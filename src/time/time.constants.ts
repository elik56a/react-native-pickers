import type { Design } from '../core/theme/theme.types';
import type { TimeColumnKey, TimeDisplay } from './time.types';

export const SECONDS_PER_MINUTE = 60;
export const SECONDS_PER_HOUR = 3600;
export const NOON_SECONDS = 12 * SECONDS_PER_HOUR;
export const LAST_SECOND_OF_DAY = 24 * SECONDS_PER_HOUR - 1;

export const DEFAULT_TIME_SEPARATOR = ':';

export const TIME_FORMAT = {
  twelveHour: '12h',
  twentyFourHour: '24h',
  auto: 'auto',
} as const;

export const TIME_COLUMN = {
  period: 'period',
  hour: 'hour',
  minute: 'minute',
  second: 'second',
} as const;

/** Read before a time panel cell, so screen readers tell an hour from a minute. AM/PM cells say enough on their own. */
export const TIME_COLUMN_LABEL: Partial<Record<TimeColumnKey, string>> = {
  hour: 'Hour',
  minute: 'Minute',
  second: 'Second',
};

export const TIME_DISPLAY = {
  wheel: 'wheel',
  list: 'list',
  dial: 'dial',
  /** Material's time input: hour and minute fields to type into, without the dial */
  input: 'input',
} as const;

/** iOS scrolls wheels, Material turns a clock dial, and the web picks from a list, like a desktop calendar app. */
export const TIME_DISPLAY_DESIGN: Record<Design, TimeDisplay> = {
  ios: TIME_DISPLAY.wheel,
  material: TIME_DISPLAY.dial,
  web: TIME_DISPLAY.list,
};

export const CLOCK_MODE = {
  hour: 'hour',
  minute: 'minute',
} as const;

export const DIAL_SIZE = 256;
/** A number's circle, and the selector at the end of the hand. */
export const DIAL_NUMBER_SIZE = 44;
/** From the dial's centre to the outer and (24h) inner ring of numbers. */
export const DIAL_OUTER_RADIUS = 104;
export const DIAL_INNER_RADIUS = 66;
export const DIAL_HAND_WIDTH = 2;
export const DIAL_CENTER_SIZE = 8;
export const DIAL_MINUTE_LABEL_STEP = 5;
export const DEGREES_PER_HOUR = 30;
export const DEGREES_PER_MINUTE = 6;
export const CLOCK_FIELD = { width: 88, height: 72, fontSize: 44 } as const;
export const CLOCK_PERIOD_WIDTH = 52;
export const CLOCK_MODE_LABEL = { hour: 'Hour', minute: 'Minute' } as const;
export const ENTRY_TOGGLE_LABEL = { toKeyboard: 'Type the time', toDial: 'Pick the time on the dial' } as const;
export const ENTRY_ICON_SIZE = 22;
export const ENTRY_TOGGLE_SIZE = 40;

/** The web's time panel: columns of clickable hours, minutes and AM/PM. */
export const TIME_CELL_HEIGHT = 36;
export const TIME_COLUMN_WIDTH = 56;
export const DEFAULT_PANEL_ROWS = 7;
