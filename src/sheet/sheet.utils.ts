import {
  DIALOG_MARGIN,
  DISMISS_DISTANCE,
  DISMISS_HEIGHT_RATIO,
  DISMISS_VELOCITY,
  DRAG_START_DISTANCE,
  DROPDOWN_EDGE_MARGIN,
  DROPDOWN_GAP,
  SHEET_MAX_WIDTH,
} from './sheet.constants';
import type { AnchorRect, DropdownFrame, SheetPresentation } from './sheet.types';

/** `height` is px, or a fraction of the window when <= 1. */
export const resolveSheetHeight = (height: number | undefined, windowHeight: number) =>
  height === undefined ? undefined : height <= 1 ? windowHeight * height : height;

export const isSwipeDown = (dx: number, dy: number) => dy > DRAG_START_DISTANCE && Math.abs(dy) > Math.abs(dx);

export const shouldDismiss = (dy: number, vy: number, sheetHeight: number) =>
  dy > Math.min(DISMISS_DISTANCE, sheetHeight * DISMISS_HEIGHT_RATIO) || vy > DISMISS_VELOCITY;

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
