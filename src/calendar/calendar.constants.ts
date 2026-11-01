import type { Design } from '../core/theme/theme.types';
import type { ArrowDirection, CalendarDesign, CalendarView, DateRange } from './calendar.types';

export const DAY_MS = 86_400_000;

export const EMPTY_RANGE: DateRange = { start: null, end: null };

export const CALENDAR_MODE = {
  single: 'single',
  range: 'range',
  multiple: 'multiple',
  ranges: 'ranges',
} as const;

export const CALENDAR_VIEW = {
  days: 'days',
  months: 'months',
  years: 'years',
} as const;

/** Tapping the title cycles days → months → years → days. */
export const NEXT_VIEW: Record<CalendarView, CalendarView> = {
  days: CALENDAR_VIEW.months,
  months: CALENDAR_VIEW.years,
  years: CALENDAR_VIEW.days,
};

export const WEEKDAY_FORMAT = {
  short: 'short',
  narrow: 'narrow',
} as const;

export const DAY_SELECTION = {
  fill: 'fill',
  tint: 'tint',
} as const;

export const TODAY_MARK = {
  ring: 'ring',
  text: 'text',
  surface: 'surface',
} as const;

/**
 * iOS tints the chosen day and colours today's number; Material fills a circle and rings today; the web fills a rounded
 * square and shades today. Range ends are filled in every design, so a tint never sits on the range band.
 */
export const CALENDAR_DESIGN: Record<Design, CalendarDesign> = {
  ios: {
    selection: DAY_SELECTION.tint,
    today: TODAY_MARK.text,
    squareDays: false,
    weekdayFormat: WEEKDAY_FORMAT.short,
    uppercaseWeekdays: true,
    arrowColor: 'primary',
  },
  material: {
    selection: DAY_SELECTION.fill,
    today: TODAY_MARK.ring,
    squareDays: false,
    weekdayFormat: WEEKDAY_FORMAT.narrow,
    uppercaseWeekdays: false,
    arrowColor: 'textSecondary',
  },
  web: {
    selection: DAY_SELECTION.fill,
    today: TODAY_MARK.surface,
    squareDays: true,
    weekdayFormat: WEEKDAY_FORMAT.short,
    uppercaseWeekdays: false,
    arrowColor: 'textSecondary',
  },
};

export const DEFAULT_DAY_HEIGHT = 44;
/** The day circle never grows past this, however tall the cell. */
export const MAX_DAY_SIZE = 40;
export const WEEKDAY_ROW_HEIGHT = 28;
export const MAX_MARKING_DOTS = 3;

export const YEARS_PER_PAGE = 12;
export const DAYS_PER_WEEK = 7;

/** How far a drag has to open or fold the month, as a fraction of the way, to carry on when let go. */
export const EXPAND_DRAG_COMMIT = 0.15;

/** The expand handle, read by screen readers. */
export const EXPAND_LABEL = {
  expand: 'Show month',
  collapse: 'Show week',
} as const;
export const QUICK_GRID_COLUMNS = 3;
/** Year grid bounds when neither yearRange nor min/max dates are given. */
export const DEFAULT_YEAR_SPAN = 100;

export const ARROW_DIRECTION = {
  prev: 'prev',
  next: 'next',
} as const;

export const ARROW_DIRECTIONS: readonly ArrowDirection[] = [ARROW_DIRECTION.prev, ARROW_DIRECTION.next];
export const ARROW_LABELS: Record<ArrowDirection, string> = { prev: 'Previous', next: 'Next' };

export const RANGE_PRESET_LABELS = {
  today: 'Today',
  yesterday: 'Yesterday',
  last7Days: 'Last 7 days',
  last30Days: 'Last 30 days',
  thisMonth: 'This month',
  lastMonth: 'Last month',
} as const;
export const RANGE_PRESETS_ACCESSIBILITY_LABEL = 'Date ranges';
