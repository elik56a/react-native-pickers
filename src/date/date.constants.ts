import type { DatePart } from './date.types';

export const DATE_PART = {
  day: 'day',
  month: 'month',
  year: 'year',
} as const;

export const MONTH_FORMAT = {
  long: 'long',
  short: 'short',
  numeric: 'numeric',
} as const;

export const FALLBACK_DATE_ORDER: DatePart[] = [DATE_PART.month, DATE_PART.day, DATE_PART.year];

/** Formatted to read a locale's day/month/year order; day 23 can't be mistaken for a month. */
export const ORDER_PROBE_DATE = new Date(2021, 10, 23);

/** Wheel years when no min/max/yearRange is given. */
export const DEFAULT_WHEEL_YEAR_SPAN = 100;

export const COLUMN_FLEX = { day: 0.8, longMonth: 1.6, month: 1, year: 1 } as const;

export const VALUE_RANGE_SEPARATOR = ' – ';
export const VALUE_LIST_SEPARATOR = ', ';
