import type { DateRange } from '../calendar/calendar.types';
import type { Locale } from '../core';
import { clampDate, daysInMonth, formatDate, getMonthNames, isOutOfRange } from '../core/utils/date.utils';
import {
  COLUMN_FLEX,
  DEFAULT_WHEEL_YEAR_SPAN,
  FALLBACK_DATE_ORDER,
  ORDER_PROBE_DATE,
  VALUE_LIST_SEPARATOR,
  VALUE_RANGE_SEPARATOR,
} from './date.constants';
import type { DateColumnSpec, DateDraft, DatePart, DateSheetMode, MonthFormat } from './date.types';

const isDatePart = (type: string): type is DatePart => type === 'day' || type === 'month' || type === 'year';

/** Day/month/year order as the locale writes dates, e.g. M/D/Y for en-US and D/M/Y for en-GB. */
export const getLocaleDateOrder = (locale?: string): DatePart[] => {
  try {
    const order = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' })
      .formatToParts(ORDER_PROBE_DATE)
      .map((part) => part.type)
      .filter(isDatePart);
    if (order.length === 3) return order;
  } catch {
    // Unknown locale: use the fallback order.
  }
  return FALLBACK_DATE_ORDER;
};

/** `date` with some parts replaced; the day shrinks to fit shorter months and the result stays within min/max. */
export const buildWheelDate = (date: Date, patch: Partial<Record<DatePart, number>>, minDate?: Date, maxDate?: Date) => {
  const year = patch.year ?? date.getFullYear();
  const month = patch.month ?? date.getMonth();
  const day = Math.min(patch.day ?? date.getDate(), daysInMonth(year, month));
  const next = new Date(date);
  next.setFullYear(year, month, day);
  return clampDate(next, minDate, maxDate);
};

/** min/max dates win over `yearRange`, which wins over ±100 years. */
export const getWheelYearBounds = (now: Date, yearRange?: [number, number], minDate?: Date, maxDate?: Date): [number, number] => [
  minDate?.getFullYear() ?? yearRange?.[0] ?? now.getFullYear() - DEFAULT_WHEEL_YEAR_SPAN,
  maxDate?.getFullYear() ?? yearRange?.[1] ?? now.getFullYear() + DEFAULT_WHEEL_YEAR_SPAN,
];

export const getDateColumnSpecs = (params: {
  date: Date;
  locale?: string;
  monthFormat: MonthFormat;
  minDate?: Date;
  maxDate?: Date;
  years: [number, number];
  loop: boolean;
}): Record<DatePart, DateColumnSpec> => {
  const { date, locale, monthFormat, minDate, maxDate, years, loop } = params;
  const year = date.getFullYear();
  const month = date.getMonth();
  const monthNames = monthFormat === 'numeric' ? null : getMonthNames(locale, monthFormat);
  const [minYear, maxYear] = years;

  return {
    day: {
      key: 'day',
      items: Array.from({ length: daysInMonth(year, month) }, (_, i) => ({
        value: i + 1,
        label: String(i + 1).padStart(monthFormat === 'numeric' ? 2 : 1, '0'),
        disabled: isOutOfRange(new Date(year, month, i + 1), minDate, maxDate),
      })),
      value: date.getDate(),
      loop,
      flex: COLUMN_FLEX.day,
    },
    month: {
      key: 'month',
      items: Array.from({ length: 12 }, (_, i) => ({
        value: i,
        label: monthNames?.[i] ?? String(i + 1).padStart(2, '0'),
        disabled: isOutOfRange(new Date(year, i, daysInMonth(year, i)), minDate, null) || isOutOfRange(new Date(year, i, 1), null, maxDate),
      })),
      value: month,
      loop,
      flex: monthFormat === 'long' ? COLUMN_FLEX.longMonth : COLUMN_FLEX.month,
    },
    year: {
      key: 'year',
      items: Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i),
      value: year,
      flex: COLUMN_FLEX.year,
    },
  };
};

export const getEmptyDraft = (mode: DateSheetMode, display: 'calendar' | 'wheel'): DateDraft => {
  if (display === 'wheel') return new Date();
  if (mode === 'range') {
    return {
      start: null,
      end: null,
    };
  }
  return mode === 'multiple' ? [] : null;
};

/** Done is enabled once a single date is picked or a range has both ends; multiple can always confirm. */
export const isDraftReady = (mode: DateSheetMode, draft: DateDraft) => {
  if (mode === 'single') return draft instanceof Date;
  if (mode === 'range') return !!(draft as DateRange | null)?.start && !!(draft as DateRange | null)?.end;
  return true;
};

/** A date sheet's value as field text: one date, a range (just its start until it has an end) or a list. */
export const formatDateValue = (value: DateDraft | undefined, locale?: Locale): string => {
  if (!value) return '';
  if (value instanceof Date) return formatDate(value, locale);
  if (Array.isArray(value)) return value.map((d) => formatDate(d, locale)).join(VALUE_LIST_SEPARATOR);
  return [value.start, value.end]
    .filter((d): d is Date => !!d)
    .map((d) => formatDate(d, locale))
    .join(VALUE_RANGE_SEPARATOR);
};
