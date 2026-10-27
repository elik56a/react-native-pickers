import type { Design } from '../core/theme/theme.types';
import type { TimeDisplay } from './time.types';

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

export const TIME_DISPLAY = {
  wheel: 'wheel',
  list: 'list',
} as const;

/** The web picks a time from a list, like a desktop calendar app; iOS and Material scroll wheels. */
export const TIME_DISPLAY_DESIGN: Record<Design, TimeDisplay> = {
  ios: TIME_DISPLAY.wheel,
  material: TIME_DISPLAY.wheel,
  web: TIME_DISPLAY.list,
};

/** A list of times steps by `minuteInterval`, or by this when it's 1. */
export const DEFAULT_LIST_STEP_MINUTES = 15;
export const DEFAULT_LIST_VISIBLE_ROWS = 6;
/** OptionRow's vertical margin, which sits outside its height. */
export const LIST_ROW_MARGIN = 2;
