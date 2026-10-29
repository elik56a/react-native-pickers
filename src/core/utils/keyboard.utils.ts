import type { KeyDownEvent, TextInputKeyPressEvent } from 'react-native';

import { ARROW_DIRECTION, CROSS_WEIGHT, DIRECTION, EDGE_TOLERANCE, FOCUS_TARGETS, IS_WEB, KEY, TEXT_FIELD_TAGS } from '../core.constants';
import type { Direction, Key, KeyHandlers, Rect, WebElement } from '../core.types';

/** Lets a control take focus and answer keys. The keys it answers don't scroll the page or reach the grid around it. */
export const keyboardProps = (handlers: KeyHandlers) => ({
  focusable: true,
  onKeyDown: (e: KeyDownEvent) => {
    const handle = handlers[e.nativeEvent.key as Key];
    if (!handle) return;
    e.preventDefault();
    e.stopPropagation();
    handle();
  },
});

/** How far `point` is outside the span from `start` to `end`. */
const outside = (point: number, start: number, end: number) => Math.max(0, start - point, point - end);

/**
 * How far apart two boxes are across the way you're going: none when either spans the other's middle, so going down
 * from a wide search field lands on the first cell under it, not the one under its middle.
 */
const across = (a: Rect, b: Rect, vertical: boolean) => {
  const [start, end] = vertical ? (['left', 'right'] as const) : (['top', 'bottom'] as const);
  const mid = (r: Rect) => (r[start] + r[end]) / 2;
  return Math.min(outside(mid(b), a[start], a[end]), outside(mid(a), b[start], b[end]));
};

/** How far `to` is from `from` going in `direction`, or null when it isn't that way at all. */
const distance = (from: Rect, to: Rect, direction: Direction): number | null => {
  const along = {
    [DIRECTION.down]: to.top - from.bottom,
    [DIRECTION.up]: from.top - to.bottom,
    [DIRECTION.right]: to.left - from.right,
    [DIRECTION.left]: from.left - to.right,
  }[direction];
  if (along < -EDGE_TOLERANCE) return null;
  const vertical = direction === DIRECTION.up || direction === DIRECTION.down;
  return Math.max(0, along) + CROSS_WEIGHT * across(from, to, vertical);
};

const isEmpty = (r: Rect) => r.right <= r.left || r.bottom <= r.top;

/**
 * The index of the nearest box in `direction`, or -1; on a tie, the first in reading order. Works on where things are
 * drawn, so any grid, list or RTL layout.
 */
export const nearestInDirection = (from: Rect, rects: readonly Rect[], direction: Direction, skip = -1) => {
  let best = -1;
  let bestDistance = Number.POSITIVE_INFINITY;
  rects.forEach((rect, index) => {
    if (index === skip || isEmpty(rect)) return;
    const d = distance(from, rect, direction);
    if (d !== null && d < bestDistance) {
      best = index;
      bestDistance = d;
    }
  });
  return best;
};

/**
 * Where arrow, Home and End keys move focus among `rects`, the focusable things in reading order, from `rects[current]`.
 * In a text field only up and down move, since the others belong to the caret. Left and right wrap to the next row.
 */
export const nextFocusIndex = (key: string, current: number, rects: readonly Rect[], rtl: boolean, inTextField = false) => {
  const from = rects[current];
  if (!from) return -1;
  if (!inTextField && key === KEY.home) return 0;
  if (!inTextField && key === KEY.end) return rects.length - 1;
  const direction = ARROW_DIRECTION[key];
  if (!direction) return -1;
  const horizontal = direction === DIRECTION.left || direction === DIRECTION.right;
  if (inTextField && horizontal) return -1;
  const nearest = nearestInDirection(from, rects, direction, current);
  if (nearest >= 0 || !horizontal) return nearest;
  const wrapped = current + ((direction === DIRECTION.right) !== rtl ? 1 : -1);
  return wrapped >= 0 && wrapped < rects.length ? wrapped : -1;
};

const moveFocus = (e: KeyDownEvent) => {
  const root = e.currentTarget as unknown as WebElement;
  const active = root.ownerDocument.activeElement;
  if (!active || !root.contains(active)) return;
  const targets = Array.from(root.querySelectorAll(FOCUS_TARGETS));
  const rtl = root.ownerDocument.defaultView?.getComputedStyle(root).direction === 'rtl';
  const rects = targets.map((target) => target.getBoundingClientRect());
  const inTextField = TEXT_FIELD_TAGS.includes(active.tagName);
  const next = targets[nextFocusIndex(e.nativeEvent.key, targets.indexOf(active), rects, rtl, inTextField)];
  if (!next) return;
  e.preventDefault();
  e.stopPropagation();
  next.focus();
};

/**
 * Spread on a picker's root: on the web, arrow keys move focus to the nearest cell, option or button that way, and
 * Home and End to the first and last. Native platforms move focus themselves.
 */
export const ARROW_FOCUS = IS_WEB ? { onKeyDown: moveFocus } : {};

/** react-native-web's TextInput stops every key from bubbling, so a search field sends up and down on from its parent. */
const passVerticalArrows = (e: TextInputKeyPressEvent) => {
  const { key } = e.nativeEvent;
  if (key !== KEY.up && key !== KEY.down) return;
  const input = e.target as unknown as WebElement;
  const KeyboardEvent = input.ownerDocument.defaultView?.KeyboardEvent;
  if (KeyboardEvent) input.parentElement?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
};

/** Spread on a search field above a list or grid, so arrow keys go from it into the results and back. */
export const SEARCH_FIELD_ARROWS = IS_WEB ? { onKeyPress: passVerticalArrows } : {};

/** What has focus on the web page, or null on native. */
export const focusedElement = (): { focus: () => void } | null =>
  IS_WEB ? ((globalThis as { document?: { activeElement: WebElement | null } }).document?.activeElement ?? null) : null;
