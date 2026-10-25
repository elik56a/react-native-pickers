import { DISMISS_DISTANCE, DISMISS_HEIGHT_RATIO, DISMISS_VELOCITY, DRAG_START_DISTANCE } from './sheet.constants';

/** `height` is px, or a fraction of the window when <= 1. */
export const resolveSheetHeight = (height: number | undefined, windowHeight: number) =>
  height === undefined ? undefined : height <= 1 ? windowHeight * height : height;

export const isSwipeDown = (dx: number, dy: number) => dy > DRAG_START_DISTANCE && Math.abs(dy) > Math.abs(dx);

export const shouldDismiss = (dy: number, vy: number, sheetHeight: number) =>
  dy > Math.min(DISMISS_DISTANCE, sheetHeight * DISMISS_HEIGHT_RATIO) || vy > DISMISS_VELOCITY;
