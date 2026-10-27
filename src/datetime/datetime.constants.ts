import { DEFAULT_DAY_HEIGHT } from '../calendar/calendar.constants';
import { PICKER_DISPLAY } from '../core/core.constants';
import type { Design } from '../core/theme/theme.types';
import { TIME_DISPLAY } from '../time/time.constants';
import type { DateTimeDesign } from './datetime.types';

/** Days listed either side of today in the day wheel when no min/max date is given. */
export const DEFAULT_DAY_SPAN = 365;

export const DAY_COLUMN_FLEX = 2.4;

export const CALENDAR_TIME_VISIBLE_ITEMS = 3;
/** Rows of the time beside a calendar: about the calendar's height. */
export const BESIDE_TIME_ROWS = 9;
/** Rows of the web's time panel under a calendar. */
export const BELOW_PANEL_ROWS = 5;

export const TIME_POSITION = {
  beside: 'beside',
  below: 'below',
} as const;

/** The calendar's width with the time beside it: square days at the calendar's default day height. */
export const BESIDE_CALENDAR_WIDTH = 7 * DEFAULT_DAY_HEIGHT;
/** Padding and border of the card that holds the calendar and the time beside it. */
export const BESIDE_PADDING = 8;
export const BESIDE_BORDER = 1;

/** iOS picks the day and time on one row of wheels; Material shows a calendar with the time under it, the web with the time beside it. */
export const DATETIME_DESIGN: Record<Design, DateTimeDesign> = {
  ios: { display: PICKER_DISPLAY.wheel, timeDisplay: TIME_DISPLAY.wheel, timePosition: TIME_POSITION.below },
  material: { display: PICKER_DISPLAY.calendar, timeDisplay: TIME_DISPLAY.input, timePosition: TIME_POSITION.below },
  web: { display: PICKER_DISPLAY.calendar, timeDisplay: TIME_DISPLAY.list, timePosition: TIME_POSITION.beside },
};

export const DAY_LABEL_FORMAT: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };

export const FALLBACK_TODAY_LABEL = 'Today';
