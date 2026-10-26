import type { ArrowDirection, CalendarView, DateRange } from './calendar.types';

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

export const DEFAULT_DAY_HEIGHT = 44;
/** The day circle never grows past this, however tall the cell. */
export const MAX_DAY_SIZE = 40;
export const WEEKDAY_ROW_HEIGHT = 28;
export const MAX_MARKING_DOTS = 3;

export const YEARS_PER_PAGE = 12;
export const QUICK_GRID_COLUMNS = 3;
/** Year grid bounds when neither yearRange nor min/max dates are given. */
export const DEFAULT_YEAR_SPAN = 100;

export const SWIPE = {
  /** Horizontal travel before the calendar claims the gesture */
  activateDistance: 14,
  /** How much more horizontal than vertical a move must be */
  directionRatio: 1.5,
  /** A release past either threshold changes the month */
  minDistance: 50,
  minVelocity: 0.5,
} as const;

/** How far (px) the month slides in from when it changes. */
export const SLIDE_DISTANCE = 40;

export const ARROW_DIRECTION = {
  prev: 'prev',
  next: 'next',
} as const;

export const ARROW_DIRECTIONS: readonly ArrowDirection[] = [ARROW_DIRECTION.prev, ARROW_DIRECTION.next];
export const ARROW_LABELS: Record<ArrowDirection, string> = { prev: 'Previous', next: 'Next' };
