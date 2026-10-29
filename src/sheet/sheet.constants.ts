import { Platform, type PlatformOSType, StatusBar } from 'react-native';

import { PLATFORM } from '../core/core.constants';
import type { Design } from '../core/theme/theme.types';
import type { FieldDesign, PickerFieldBaseProps, SheetDesign } from './sheet.types';

export const SHEET_PRESENTATION = {
  auto: 'auto',
  bottomSheet: 'bottomSheet',
  modal: 'modal',
} as const;

/** A field opens its picker in one of the sheet presentations, in a dropdown under the field, or inline: expanded under it. */
export const FIELD_PRESENTATION = {
  ...SHEET_PRESENTATION,
  dropdown: 'dropdown',
  inline: 'inline',
} as const;

export const SHEET_SNAP = {
  base: 'base',
  expanded: 'expanded',
  close: 'close',
} as const;

export const SHEET_ACTIONS = {
  header: 'header',
  footer: 'footer',
} as const;

export const TITLE_ALIGN = {
  center: 'center',
  start: 'start',
} as const;

/** iOS puts Cancel / Done beside a centered title; Material and the web put the title first and Cancel / OK at the bottom. */
export const SHEET_DESIGN: Record<Design, SheetDesign> = {
  ios: { actions: SHEET_ACTIONS.header, titleAlign: TITLE_ALIGN.center, confirmLabel: 'Done' },
  material: { actions: SHEET_ACTIONS.footer, titleAlign: TITLE_ALIGN.start, confirmLabel: 'OK' },
  web: { actions: SHEET_ACTIONS.footer, titleAlign: TITLE_ALIGN.start, confirmLabel: 'Done' },
};

export const FIELD_LABEL = {
  above: 'above',
  floating: 'floating',
} as const;

export const FIELD_ARROW = {
  chevron: 'chevron',
  triangle: 'triangle',
} as const;

/** Material fields are outlined, with the label inside until there's a value and then on the border; web fields are compact, with a focus ring. */
export const FIELD_DESIGN: Record<Design, FieldDesign> = {
  ios: { label: FIELD_LABEL.above, arrow: FIELD_ARROW.chevron, minHeight: 48, outline: 'border', openBorderWidth: 1, focusRing: false },
  material: {
    label: FIELD_LABEL.floating,
    arrow: FIELD_ARROW.triangle,
    minHeight: 56,
    outline: 'textSecondary',
    openBorderWidth: 2,
    focusRing: false,
  },
  web: { label: FIELD_LABEL.above, arrow: FIELD_ARROW.chevron, minHeight: 40, outline: 'border', openBorderWidth: 1, focusRing: true },
};
export const FOCUS_RING_WIDTH = 3;
/** Space either side of a floating label, cut out of the border behind it. */
export const FLOATING_LABEL_PADDING = 4;
/** A raised floating label shrinks from the body text size to this one. */
export const FLOATING_LABEL_RAISED_SIZE = 'xs';

export const DEFAULT_CANCEL_LABEL = 'Cancel';
export const DEFAULT_MAX_HEIGHT_RATIO = 0.9;
/** Room under a bottom sheet for the iOS home indicator, and a smaller margin elsewhere. */
export const IOS_BOTTOM_INSET = 24;
export const DEFAULT_BOTTOM_INSET = 12;

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

/** Room kept above an expanded sheet for the status bar. */
export const EXPANDED_TOP_INSET: Partial<Record<PlatformOSType, number>> = {
  [PLATFORM.ios]: 54,
  [PLATFORM.android]: StatusBar.currentHeight ?? 24,
};
/** A flick faster than this (px/ms) snaps an expandable sheet up or down regardless of distance. */
export const EXPAND_FLICK_VELOCITY = 0.5;
/** Expanding and collapsing run quicker than opening, as a fraction of the theme's animation duration. */
export const RESIZE_DURATION_RATIO = 0.6;
/** Spring speed for the sheet settling back after a drag. */
export const SNAP_BACK_SPEED = 20;

export const IS_WEB = Platform.OS === PLATFORM.web;
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
export const DROPDOWN_PADDING = 6;
/** Space between the field and the dropdown. */
export const DROPDOWN_GAP = 4;
/** Space kept between the dropdown and the window edge. */
export const DROPDOWN_EDGE_MARGIN = 8;
/** A picker in a dropdown is at least this wide, so a calendar keeps its tap targets under a narrow field. */
export const PICKER_DROPDOWN_MIN_WIDTH = 320;
/** A picker dropdown's assumed height until its content is measured: about a calendar with its Done row. */
export const PICKER_DROPDOWN_MAX_HEIGHT = 440;

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
  'presentation',
  'style',
  'testID',
] as const satisfies ReadonlyArray<keyof PickerFieldBaseProps>;
