import type { PlatformOSType } from 'react-native';

import { PLATFORM } from '../core/core.constants';
import type { DistributiveOmit } from '../core/core.types';
import {
  DEFAULT_BOTTOM_INSET,
  DIALOG_MARGIN,
  DISMISS_DISTANCE,
  DISMISS_HEIGHT_RATIO,
  DISMISS_VELOCITY,
  DRAG_START_DISTANCE,
  DROPDOWN_EDGE_MARGIN,
  DROPDOWN_GAP,
  EXPAND_FLICK_VELOCITY,
  EXPANDED_TOP_INSET,
  FIELD_PRESENTATION,
  FIELD_PROP_KEYS,
  IOS_BOTTOM_INSET,
  SCROLLABLE_OVERFLOW,
  SHEET_MAX_WIDTH,
  SHEET_PRESENTATION,
  SHEET_SNAP,
} from './sheet.constants';
import type {
  AnchorRect,
  DropdownFrame,
  FieldPresentation,
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
  if (frame.offset > 0) return canClose && shouldDismiss(frame.offset, vy, base) ? SHEET_SNAP.close : SHEET_SNAP.base;
  if (max <= base) return SHEET_SNAP.base;
  if (vy < -EXPAND_FLICK_VELOCITY) return SHEET_SNAP.expanded;
  if (vy > EXPAND_FLICK_VELOCITY) return SHEET_SNAP.base;
  return frame.height - base > (max - base) / 2 ? SHEET_SNAP.expanded : SHEET_SNAP.base;
};

/** Wheel up expands, wheel down collapses an expanded sheet or closes one at its base height. */
export const getWheelTarget = (deltaY: number, expanded: boolean, expandable: boolean, canClose: boolean): SheetSnap | null => {
  if (deltaY < 0) return expandable && !expanded ? SHEET_SNAP.expanded : null;
  if (expanded) return SHEET_SNAP.base;
  return canClose ? SHEET_SNAP.close : null;
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
export const resolvePresentation = (
  presentation: SheetPresentation,
  platform: PlatformOSType,
  windowWidth: number
): Exclude<SheetPresentation, typeof SHEET_PRESENTATION.auto> => {
  if (presentation !== SHEET_PRESENTATION.auto) return presentation;
  return platform === PLATFORM.web && windowWidth >= SHEET_MAX_WIDTH + DIALOG_MARGIN * 2
    ? SHEET_PRESENTATION.modal
    : SHEET_PRESENTATION.bottomSheet;
};

/** A field's `auto`: a dropdown on the web, where options are expected under the field; on native, a sheet (`auto` again, resolved by the sheet). */
export const resolveFieldPresentation = (presentation: FieldPresentation, platform: PlatformOSType): FieldPresentation =>
  presentation === FIELD_PRESENTATION.auto && platform === PLATFORM.web ? FIELD_PRESENTATION.dropdown : presentation;

/** A tap on an open inline field collapses it; any other tap opens the picker. */
export const shouldCollapseOnPress = (presentation: FieldPresentation, open: boolean) => open && presentation === FIELD_PRESENTATION.inline;

/** Platform defaults for a bottom sheet. Mouse drags on the header would select its text on the web, so there only the handle drags. */
export const getSheetDefaults = (platform: PlatformOSType) => ({
  bottomInset: platform === PLATFORM.ios ? IOS_BOTTOM_INSET : DEFAULT_BOTTOM_INSET,
  draggable: platform !== PLATFORM.web,
  expandedTopInset: EXPANDED_TOP_INSET[platform] ?? 0,
});

/** Opens below the anchor, or above it when there's more room there and not enough below. Grows to `minWidth`, kept inside the window. */
export const getDropdownFrame = (
  anchor: AnchorRect,
  windowSize: { width: number; height: number },
  preferredHeight: number,
  minWidth = 0
): DropdownFrame => {
  const windowHeight = windowSize.height;
  const width = Math.max(anchor.width, Math.min(minWidth, windowSize.width - DROPDOWN_EDGE_MARGIN * 2));
  const left = Math.max(0, Math.min(anchor.x, windowSize.width - DROPDOWN_EDGE_MARGIN - width));
  const below = windowHeight - (anchor.y + anchor.height) - DROPDOWN_GAP - DROPDOWN_EDGE_MARGIN;
  const above = anchor.y - DROPDOWN_GAP - DROPDOWN_EDGE_MARGIN;
  if (below < preferredHeight && above > below) {
    return {
      left,
      width,
      bottom: windowHeight - anchor.y + DROPDOWN_GAP,
      maxHeight: Math.min(preferredHeight, above),
    };
  }
  return {
    left,
    width,
    top: anchor.y + anchor.height + DROPDOWN_GAP,
    maxHeight: Math.min(preferredHeight, below),
  };
};

type FieldPropKey = (typeof FIELD_PROP_KEYS)[number];
type SharedFieldPropKey = 'theme' | 'design' | 'styles';

/** Splits a `*PickerField`'s props into the field's and its sheet's; both get `theme`, `design` and `styles`. */
export const splitFieldProps = <P extends PickerFieldBaseProps<string>>(props: P) => {
  const field: Partial<Record<FieldPropKey | SharedFieldPropKey, unknown>> = {
    theme: props.theme,
    design: props.design,
    styles: props.styles,
  };
  const sheet: Record<string, unknown> = { ...(props as object) };
  for (const key of FIELD_PROP_KEYS) {
    field[key] = props[key];
    delete sheet[key];
  }
  return {
    field: field as Pick<PickerFieldBaseProps<string>, FieldPropKey | SharedFieldPropKey>,
    sheet: sheet as DistributiveOmit<P, FieldPropKey>,
  };
};

/**
 * Where a raised floating label moves from its resting place, centred in the field: up onto the top border, and left so it
 * still starts at the same edge once scaled down (it scales around its centre).
 */
export const getFloatingLabelShift = (boxHeight: number, textWidth: number, scale: number, borderWidth: number) => ({
  x: (-textWidth * (1 - scale)) / 2,
  y: -(boxHeight + borderWidth) / 2,
});
