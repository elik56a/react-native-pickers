import type { KeyboardTypeOptions } from 'react-native';
import { Platform } from 'react-native';

export const DEFAULT_ITEM_HEIGHT = 40;
export const DEFAULT_VISIBLE_ITEMS = 5;
export const DEFAULT_ROTATION_DEG = 20;
export const DEFAULT_FADE_TO = 0.3;

/** A looping wheel renders at least this many copies, and enough to give ~LOOP_MIN_ROWS rows either side. */
export const LOOP_MIN_COPIES = 7;
export const LOOP_MIN_ROWS = 240;

/** ms to wait after the last scroll signal before snapping / committing. */
export const SETTLE_DELAY = { scrollNative: 140, scrollWeb: 110, dragEnd: 140, momentumEnd: 16 } as const;

/** Offsets within this many px of a row count as aligned. */
export const ALIGN_TOLERANCE_PX = 1;

export const PERSPECTIVE = 1000;
export const FLAT_UNSELECTED_SCALE = 0.94;
/** Keeps edge rows just short of 90°, where they would collapse to a line. */
export const EDGE_ANGLE_MARGIN_RAD = 0.05;

export const NUMERIC_KEYBOARD_TYPE: KeyboardTypeOptions = Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'number-pad';
