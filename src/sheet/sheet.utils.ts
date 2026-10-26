import type { DistributiveOmit } from '../core/core.types';
import {
  DIALOG_MARGIN,
  DISMISS_DISTANCE,
  DISMISS_HEIGHT_RATIO,
  DISMISS_VELOCITY,
  DRAG_START_DISTANCE,
  DROPDOWN_EDGE_MARGIN,
  DROPDOWN_GAP,
  EXPAND_FLICK_VELOCITY,
  FIELD_PROP_KEYS,
  SCROLLABLE_OVERFLOW,
  SHEET_MAX_WIDTH,
} from './sheet.constants';
import type {
  AnchorRect,
  DropdownFrame,
  PickerFieldBaseProps,
  ScrollNode,
  SheetDragFrame,
  SheetPresentation,
  SheetSnap,
} from './sheet.types';

/** `height` is px, or a fraction of the window when <= 1. */
export const resolveSheetHeight = (height: number | undefined, windowHeight: number) =>
  height === undefined ? undefined : height <= 1 ? windowHeight * height : height;

export const isVerticalDrag = (dx: number, dy: number) => Math.abs(dy) > DRAG_START_DISTANCE && Math.abs(dy) > Math.abs(dx);

export const shouldDismiss = (dy: number, vy: number, sheetHeight: number) =>
  dy > Math.min(DISMISS_DISTANCE, sheetHeight * DISMISS_HEIGHT_RATIO) || vy > DISMISS_VELOCITY;

/** Above `base` the sheet grows (up to `max`); below it, it's pulled down towards closing. */
export const getDragFrame = (startHeight: number, dy: number, base: number, max: number, canClose: boolean): SheetDragFrame => {
  const height = startHeight - dy;
  return {
    height: Math.min(Math.max(height, base), Math.max(max, base)),
    offset: canClose ? Math.max(0, base - height) : 0,
  };
};

export const getReleaseTarget = (frame: SheetDragFrame, vy: number, base: number, max: number, canClose: boolean): SheetSnap => {
  if (frame.offset > 0) return canClose && shouldDismiss(frame.offset, vy, base) ? 'close' : 'base';
  if (max <= base) return 'base';
  if (vy < -EXPAND_FLICK_VELOCITY) return 'expanded';
  if (vy > EXPAND_FLICK_VELOCITY) return 'base';
  return frame.height - base > (max - base) / 2 ? 'expanded' : 'base';
};

/** Wheel up expands, wheel down collapses an expanded sheet or closes one at its base height. */
export const getWheelTarget = (deltaY: number, expanded: boolean, expandable: boolean, canClose: boolean): SheetSnap | null => {
  if (deltaY < 0) return expandable && !expanded ? 'expanded' : null;
  if (expanded) return 'base';
  return canClose ? 'close' : null;
};

/** Whether a scroll container between `target` and `root` can still scroll that way, so the wheel belongs to it. */
export const canScrollWithin = (
  target: ScrollNode | null,
  root: ScrollNode,
  deltaY: number,
  overflowOf: (node: ScrollNode) => string
): boolean => {
  for (let node = target; node && node !== root; node = node.parentElement) {
    if (!SCROLLABLE_OVERFLOW.includes(overflowOf(node))) continue;
    if (deltaY < 0 ? node.scrollTop > 0 : node.scrollTop + node.clientHeight < node.scrollHeight - 1) return true;
  }
  return false;
};

/** `auto` picks a modal on web windows wider than the sheet, where a bottom sheet looks cut off. */
export const resolvePresentation = (presentation: SheetPresentation, platform: string, windowWidth: number): 'bottomSheet' | 'modal' => {
  if (presentation !== 'auto') return presentation;
  return platform === 'web' && windowWidth >= SHEET_MAX_WIDTH + DIALOG_MARGIN * 2 ? 'modal' : 'bottomSheet';
};

/** Opens below the anchor, or above it when there's more room there and not enough below. */
export const getDropdownFrame = (anchor: AnchorRect, windowHeight: number, preferredHeight: number): DropdownFrame => {
  const below = windowHeight - (anchor.y + anchor.height) - DROPDOWN_GAP - DROPDOWN_EDGE_MARGIN;
  const above = anchor.y - DROPDOWN_GAP - DROPDOWN_EDGE_MARGIN;
  if (below < preferredHeight && above > below) {
    return {
      left: anchor.x,
      width: anchor.width,
      bottom: windowHeight - anchor.y + DROPDOWN_GAP,
      maxHeight: Math.min(preferredHeight, above),
    };
  }
  return {
    left: anchor.x,
    width: anchor.width,
    top: anchor.y + anchor.height + DROPDOWN_GAP,
    maxHeight: Math.min(preferredHeight, below),
  };
};

type FieldPropKey = (typeof FIELD_PROP_KEYS)[number];

/** Splits a `*PickerField`'s props into the field's and its sheet's; both get `theme` and `styles`. */
export const splitFieldProps = <P extends PickerFieldBaseProps<string>>(props: P) => {
  const field: Partial<Record<FieldPropKey | 'theme' | 'styles', unknown>> = {
    theme: props.theme,
    styles: props.styles,
  };
  const sheet: Record<string, unknown> = { ...(props as object) };
  for (const key of FIELD_PROP_KEYS) {
    field[key] = props[key];
    delete sheet[key];
  }
  return {
    field: field as Pick<PickerFieldBaseProps<string>, FieldPropKey | 'theme' | 'styles'>,
    sheet: sheet as DistributiveOmit<P, FieldPropKey>,
  };
};
