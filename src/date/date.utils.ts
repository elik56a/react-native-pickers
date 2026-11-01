import { CALENDAR_MODE } from '../calendar/calendar.constants';
import type { DateRange } from '../calendar/calendar.types';
import type { Locale } from '../core';
import { PICKER_DISPLAY } from '../core/core.constants';
import type { PickerDisplay } from '../core/core.types';
import { clampDate, daysInMonth, formatDate, getMonthNames, isOutOfRange } from '../core/utils/date.utils';
import {
  COLUMN_FLEX,
  DATE_PART,
  FALLBACK_DATE_ORDER,
  HEADLINE_FORMAT,
  HEADLINE_PLACEHOLDER,
  MONTH_FORMAT,
  ORDER_PROBE_DATE,
  RANGE_HEADLINE_FORMAT,
  VALUE_LIST_SEPARATOR,
  VALUE_RANGE_SEPARATOR,
} from './date.constants';
import type { DateColumnSpec, DateDraft, DatePart, DateSheetMode, MonthFormat } from './date.types';

const isDatePart = (type: string): type is DatePart => Object.values<string>(DATE_PART).includes(type);

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
  const monthNames = monthFormat === MONTH_FORMAT.numeric ? null : getMonthNames(locale, monthFormat);
  const [minYear, maxYear] = years;

  return {
    day: {
      key: DATE_PART.day,
      items: Array.from({ length: daysInMonth(year, month) }, (_, i) => ({
        value: i + 1,
        label: String(i + 1).padStart(monthFormat === MONTH_FORMAT.numeric ? 2 : 1, '0'),
        disabled: isOutOfRange(new Date(year, month, i + 1), minDate, maxDate),
      })),
      value: date.getDate(),
      loop,
      flex: COLUMN_FLEX.day,
    },
    month: {
      key: DATE_PART.month,
      items: Array.from({ length: 12 }, (_, i) => ({
        value: i,
        label: monthNames?.[i] ?? String(i + 1).padStart(2, '0'),
        disabled: isOutOfRange(new Date(year, i, daysInMonth(year, i)), minDate, null) || isOutOfRange(new Date(year, i, 1), null, maxDate),
      })),
      value: month,
      loop,
      flex: monthFormat === MONTH_FORMAT.long ? COLUMN_FLEX.longMonth : COLUMN_FLEX.month,
    },
    year: {
      key: DATE_PART.year,
      items: Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i),
      value: year,
      flex: COLUMN_FLEX.year,
    },
  };
};

/** The wheel holds one date, so every mode but single shows the calendar. */
export const getSheetDisplay = (mode: DateSheetMode, display: PickerDisplay) =>
  mode === CALENDAR_MODE.single ? display : PICKER_DISPLAY.calendar;

export const getEmptyDraft = (mode: DateSheetMode, display: PickerDisplay): DateDraft => {
  if (display === PICKER_DISPLAY.wheel) return new Date();
  if (mode === CALENDAR_MODE.range) {
    return {
      start: null,
      end: null,
    };
  }
  return mode === CALENDAR_MODE.multiple || mode === CALENDAR_MODE.ranges ? [] : null;
};

/** Done is enabled once a single date is picked or a range has both ends; multiple can always confirm, ranges once none is half-picked. */
export const isDraftReady = (mode: DateSheetMode, draft: DateDraft) => {
  if (mode === CALENDAR_MODE.single) return draft instanceof Date;
  if (mode === CALENDAR_MODE.range) return !!(draft as DateRange | null)?.start && !!(draft as DateRange | null)?.end;
  if (mode === CALENDAR_MODE.ranges) return (draft as DateRange[]).every((r) => r.end);
  return true;
};

/** A date sheet's value as field text: one date, a range (just its start until it has an end) or a list of either. */
export const formatDateValue = (value: DateDraft | undefined, locale?: Locale): string => {
  if (!value) return '';
  if (value instanceof Date) return formatDate(value, locale);
  if (Array.isArray(value)) return value.map((item: Date | DateRange) => formatDateValue(item, locale)).join(VALUE_LIST_SEPARATOR);
  return [value.start, value.end]
    .filter((d): d is Date => !!d)
    .map((d) => formatDate(d, locale))
    .join(VALUE_RANGE_SEPARATOR);
};

/** The large date above a Material calendar: 'Mon, Oct 27', or 'Oct 27 – Oct 30' for a range. Null for modes that pick several. */
export const formatDateHeadline = (mode: DateSheetMode, draft: DateDraft, locale?: Locale): string | null => {
  if (mode === CALENDAR_MODE.single) return draft instanceof Date ? formatDate(draft, locale, HEADLINE_FORMAT) : HEADLINE_PLACEHOLDER.date;
  if (mode !== CALENDAR_MODE.range) return null;
  const range = draft as DateRange | null;
  const start = range?.start ? formatDate(range.start, locale, RANGE_HEADLINE_FORMAT) : HEADLINE_PLACEHOLDER.start;
  const end = range?.end ? formatDate(range.end, locale, RANGE_HEADLINE_FORMAT) : HEADLINE_PLACEHOLDER.end;
  return `${start}${VALUE_RANGE_SEPARATOR}${end}`;
};
