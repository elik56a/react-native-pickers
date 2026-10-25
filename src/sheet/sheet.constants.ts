import { Platform } from 'react-native';

export const DEFAULT_CONFIRM_LABEL = 'Done';
export const DEFAULT_CANCEL_LABEL = 'Cancel';
export const DEFAULT_MAX_HEIGHT_RATIO = 0.9;
export const DEFAULT_BOTTOM_INSET = Platform.OS === 'ios' ? 24 : 12;

/** react-native-web has no native animated module. */
export const USE_NATIVE_DRIVER = Platform.OS !== 'web';

/** Opening runs a little longer than closing so the sheet settles instead of snapping in. */
export const OPEN_EXTRA_DURATION_MS = 60;

/** Downward movement before a drag is treated as a swipe-to-close rather than a tap. */
export const DRAG_START_DISTANCE = 6;
/** Released past this many px (or this fraction of the sheet, whichever is smaller) closes the sheet. */
export const DISMISS_DISTANCE = 140;
export const DISMISS_HEIGHT_RATIO = 0.3;
/** A flick faster than this (px/ms) closes the sheet regardless of distance. */
export const DISMISS_VELOCITY = 0.9;
export const SNAP_BACK_BOUNCINESS = 4;

export const BUTTON_HIT_SLOP = 10;
export const PRESSED_BUTTON_OPACITY = 0.5;
