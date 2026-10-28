import { SCROLL_ARROW_SIDE } from './list.constants';
import type { HorizontalListArrowSide, ItemLayout, ScrollFrame } from './list.types';

/**
 * Where to scroll after pressing item `index`, so its neighbors show too: pressing the last visible item reveals the next one,
 * plus `peek` px hinting there's more. Null when everything wanted is already in view.
 */
export const getRevealOffset = (layouts: ReadonlyArray<ItemLayout | undefined>, index: number, frame: ScrollFrame, peek: number) => {
  const item = layouts[index];
  const { offset, width, contentWidth } = frame;
  if (!item || width <= 0) return null;
  const before = layouts[index - 1] ?? item;
  const after = layouts[index + 1] ?? item;
  const start = Math.max(0, before.x - peek);
  const end = Math.min(contentWidth, after.x + after.width + peek);
  let target = offset;
  // Each way, the pressed item itself stays in view even when its neighbor doesn't fit.
  if (end > offset + width) target = Math.min(end - width, item.x - peek);
  else if (start < offset) target = Math.max(start, item.x + item.width + peek - width);
  const clamped = Math.max(0, Math.min(target, contentWidth - width));
  return Math.abs(clamped - offset) < 1 ? null : clamped;
};

/** Index of the item holding `value`, -1 for none. */
export const findItemIndex = <T>(items: ReadonlyArray<{ value: T }>, value: T | null | undefined, isEqual: (a: T, b: T) => boolean) =>
  value === undefined || value === null ? -1 : items.findIndex((item) => isEqual(item.value, value));

/** Which sides have content hidden past them, so an arrow shows there. A pixel of slack absorbs fractional scroll offsets. */
export const getHiddenSides = ({ offset, width, contentWidth }: ScrollFrame) => ({
  left: width > 0 && offset > 1,
  right: width > 0 && offset + width < contentWidth - 1,
});

/** Where an arrow scrolls: a visible width toward `side`, less `inset`, so what the arrows covered comes into view. */
export const getPageOffset = ({ offset, width, contentWidth }: ScrollFrame, side: HorizontalListArrowSide, inset: number) => {
  const step = Math.max(width - inset, 0);
  const target = side === SCROLL_ARROW_SIDE.right ? offset + step : offset - step;
  return Math.max(0, Math.min(target, contentWidth - width));
};
