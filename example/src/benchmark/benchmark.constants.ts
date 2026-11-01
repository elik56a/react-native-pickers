/** How long each JS block lasts (ms). The JS thread is free for `JS_LOAD_GAP_MS` between blocks, as during a heavy list render. */
export const JS_LOAD_LEVELS = [0, 50, 100, 200] as const;
export const JS_LOAD_GAP_MS = 16;
export const FPS_WINDOW_MS = 1000;
export const WHEEL_ITEMS = Array.from({ length: 200 }, (_, i) => ({
  label: `Item ${i}`,
  value: i,
}));
export const LOG_TAG = 'PICKERS_BENCH';
export const SHEET_TITLE = 'Bench sheet';
