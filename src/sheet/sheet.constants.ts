import { Platform, StatusBar } from 'react-native';

import type { PickerFieldBaseProps } from './sheet.types';

export const SHEET_PRESENTATION = {
  auto: 'auto',
  bottomSheet: 'bottomSheet',
  modal: 'modal',
} as const;

export const SHEET_SNAP = {
  base: 'base',
  expanded: 'expanded',
  close: 'close',
} as const;

export const DEFAULT_CONFIRM_LABEL = 'Done';
export const DEFAULT_CANCEL_LABEL = 'Cancel';
export const DEFAULT_MAX_HEIGHT_RATIO = 0.9;
export const DEFAULT_BOTTOM_INSET = Platform.OS === 'ios' ? 24 : 12;

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

/** Mouse drags on the header would select its text on the web, so there only the handle drags by default. */
export const DEFAULT_DRAGGABLE = Platform.OS !== 'web';
/** Room kept above an expanded sheet for the status bar. */
export const EXPANDED_TOP_INSET = Platform.select({ ios: 54, android: StatusBar.currentHeight ?? 24, default: 0 });
/** A flick faster than this (px/ms) snaps an expandable sheet up or down regardless of distance. */
export const EXPAND_FLICK_VELOCITY = 0.5;
/** Expanding and collapsing run quicker than opening, as a fraction of the theme's animation duration. */
export const RESIZE_DURATION_RATIO = 0.6;
/** Spring speed for the sheet settling back after a drag. */
export const SNAP_BACK_SPEED = 20;

export const IS_WEB = Platform.OS === 'web';
/** Wheel distance (px) that expands, collapses or closes the sheet. */
export const WHEEL_THRESHOLD = 40;
/** A wheel gesture (and trackpad momentum) counts as over after this long without events. */
export const WHEEL_IDLE_MS = 180;
export const SCROLLABLE_OVERFLOW = ['auto', 'scroll'];

export const SHEET_MAX_WIDTH = 640;
/** Space kept around the dialog on wide web windows. */
export const DIALOG_MARGIN = 24;
/** The dialog rises this far while fading in, instead of sliding up from the bottom edge. */
export const DIALOG_RISE = 24;

export const DROPDOWN_MAX_HEIGHT = 320;
/** Space between the field and the dropdown. */
export const DROPDOWN_GAP = 4;
/** Space kept between the dropdown and the window edge. */
export const DROPDOWN_EDGE_MARGIN = 8;

export const BUTTON_HIT_SLOP = 10;

export const DEFAULT_PLACEHOLDER = 'Select…';
export const DISABLED_TRIGGER_OPACITY = 0.5;

/** The `PickerField` props a `*PickerField` keeps for itself; the rest go to its sheet. `theme` and `styles` go to both. */
export const FIELD_PROP_KEYS = [
  'label',
  'placeholder',
  'displayValue',
  'disabled',
  'clearable',
  'onClear',
  'renderTrigger',
  'renderChevron',
  'onOpen',
  'onClose',
  'style',
  'testID',
] as const satisfies ReadonlyArray<keyof PickerFieldBaseProps>;
