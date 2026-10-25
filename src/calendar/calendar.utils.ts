import type { PickerTheme } from '../core';
import { addMonths, compareDay, isBetweenDays, isOutOfRange, isSameDay, startOfMonth, toDateKey } from '../core/utils/date.utils';
import {
  DAY_MS,
  DEFAULT_YEAR_SPAN,
  MAX_DAY_SIZE,
  QUICK_GRID_COLUMNS,
  SWIPE,
  WEEKDAY_ROW_HEIGHT,
  YEARS_PER_PAGE,
} from './calendar.constants';
import type {
  ArrowDirection,
  CalendarSelection,
  CalendarView,
  DateRange,
  DayDisabledRules,
  DayState,
  MarkedDate,
  QuickCell,
  RangeRules,
  Weekday,
} from './calendar.types';

export const isDayDisabled = (day: Date, { minDate, maxDate, isDateDisabled, markedDates }: DayDisabledRules) =>
  isOutOfRange(day, minDate, maxDate) || !!isDateDisabled?.(day) || !!markedDates?.[toDateKey(day)]?.disabled;

/** True when any day from `start` up to (not including) `end` is disabled. */
export const rangeCrossesDisabled = (start: Date, end: Date, isDisabled: (day: Date) => boolean) => {
  for (let day = new Date(start); compareDay(day, end) < 0; day = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1)) {
    if (isDisabled(day)) return true;
  }
  return false;
};

/**
 * The range after tapping `day`, or null when the tap should be ignored.
 * A tap starts a new range unless it completes the open one; ranges that are too long
 * or cross a disabled day restart from the tapped day instead.
 */
export const nextRange = (range: DateRange, day: Date, rules: RangeRules, isDisabled: (day: Date) => boolean): DateRange | null => {
  const restart = {
    start: day,
    end: null,
  };
  if (!range.start || range.end || compareDay(day, range.start) < 0) return restart;

  const nights = Math.round((day.getTime() - range.start.getTime()) / DAY_MS);
  if (nights === 0 && rules.allowSingleDayRange === false) return null;
  if (rules.minRangeDays !== undefined && nights < rules.minRangeDays) return null;
  if (rules.maxRangeDays !== undefined && nights > rules.maxRangeDays) return restart;
  if (rangeCrossesDisabled(range.start, day, isDisabled)) return restart;
  return {
    start: range.start,
    end: day,
  };
};

/** Dates after toggling `day`, kept in order; null when adding would pass `maxSelections`. */
export const toggleMultiple = (dates: Date[], day: Date, maxSelections?: number): Date[] | null => {
  if (dates.some((d) => isSameDay(d, day))) return dates.filter((d) => !isSameDay(d, day));
  if (maxSelections !== undefined && dates.length >= maxSelections) return null;
  return [...dates, day].sort((a, b) => a.getTime() - b.getTime());
};

export const getAnchorMonth = (initialMonth: Date | undefined, selection: CalendarSelection) =>
  startOfMonth(initialMonth ?? selection.single ?? selection.range.start ?? selection.multiple[0] ?? new Date());

export const getDayState = (params: {
  date: Date;
  month: Date;
  today: Date;
  selection: CalendarSelection;
  isDisabled: (day: Date) => boolean;
  markedDates?: Record<string, MarkedDate>;
}): DayState => {
  const { date, month, today, selection, isDisabled, markedDates } = params;
  const { mode, single, range, multiple } = selection;
  const rangeStart = mode === 'range' && isSameDay(date, range.start);
  const rangeEnd = mode === 'range' && isSameDay(date, range.end);
  const selected =
    mode === 'single' ? isSameDay(date, single) : mode === 'range' ? rangeStart || rangeEnd : multiple.some((d) => isSameDay(d, date));
  return {
    date,
    outside: date.getMonth() !== month.getMonth(),
    today: isSameDay(date, today),
    disabled: isDisabled(date),
    rangeStart,
    rangeEnd,
    inRange: mode === 'range' && isBetweenDays(date, range.start, range.end),
    selected,
    marking: markedDates?.[toDateKey(date)],
  };
};

export const getWeekStates = (grid: Date[][], params: Omit<Parameters<typeof getDayState>[0], 'date'>) =>
  grid.map((week) => week.map((date) => getDayState({ ...params, date })));

/** A completed range paints a band behind its days; a one-day range has nothing to connect. */
export const showsRangeBand = (state: DayState, hasRangeEnd: boolean) =>
  state.inRange || (hasRangeEnd && (state.rangeStart || state.rangeEnd) && !(state.rangeStart && state.rangeEnd));

export const getDayTextColor = (state: DayState, colors: PickerTheme['colors']) => {
  if (state.selected) return colors.onPrimary;
  if (state.disabled) return colors.textDisabled;
  if (state.marking?.textColor !== undefined) return state.marking.textColor;
  if (state.outside) return colors.textDisabled;
  return state.today ? colors.primary : colors.text;
};

export const getDaySize = (dayHeight: number) => Math.min(dayHeight - 4, MAX_DAY_SIZE);

/** Weekday headers starting at `firstDayOfWeek`, keyed by day of week (narrow names repeat, e.g. S M T W T F S). */
export const orderWeekdays = (names: string[], firstDayOfWeek: number): Weekday[] =>
  Array.from({ length: 7 }, (_, i) => {
    const dayOfWeek = (firstDayOfWeek + i) % 7;
    return {
      key: dayOfWeek,
      label: names[dayOfWeek] ?? '',
    };
  });

/** ‹ points to the previous month, mirrored in RTL. */
export const getArrowGlyph = (direction: ArrowDirection, rtl: boolean) => ((direction === 'prev') !== rtl ? '‹' : '›');

export const canGoToMonth = (month: Date, delta: number, minDate?: Date, maxDate?: Date) => {
  const target = addMonths(month, delta);
  if (delta < 0) return !minDate || compareDay(target, startOfMonth(minDate)) >= 0;
  return !maxDate || compareDay(target, startOfMonth(maxDate)) <= 0;
};

/** Arrows page by month in the day view, by year in the month view and by 12 years in the year view. */
export const shiftMonthForView = (view: Exclude<CalendarView, 'days'>, month: Date, delta: number) => {
  const years = view === 'months' ? delta : delta * YEARS_PER_PAGE;
  return new Date(month.getFullYear() + years, month.getMonth(), 1);
};

export const getYearPageStart = (year: number) => Math.floor(year / YEARS_PER_PAGE) * YEARS_PER_PAGE;

export const getYearPageLabel = (year: number) => {
  const start = getYearPageStart(year);
  return `${start} – ${start + YEARS_PER_PAGE - 1}`;
};

export const getHeaderLabel = (view: CalendarView, month: Date, title: string) => {
  if (view === 'years') return getYearPageLabel(month.getFullYear());
  if (view === 'months') return String(month.getFullYear());
  return title;
};

export const getMonthCells = (month: Date, monthNames: string[], minDate?: Date, maxDate?: Date): QuickCell[] =>
  monthNames.map((label, m) => {
    const first = new Date(month.getFullYear(), m, 1);
    const last = new Date(month.getFullYear(), m + 1, 0);
    return {
      key: String(m),
      label,
      value: m,
      selected: m === month.getMonth(),
      disabled: (!!minDate && compareDay(last, minDate) < 0) || (!!maxDate && compareDay(first, maxDate) > 0),
    };
  });

export const getYearBounds = (today: Date, yearRange?: [number, number], minDate?: Date, maxDate?: Date): [number, number] =>
  yearRange ?? [
    minDate?.getFullYear() ?? today.getFullYear() - DEFAULT_YEAR_SPAN,
    maxDate?.getFullYear() ?? today.getFullYear() + DEFAULT_YEAR_SPAN,
  ];

export const getYearCells = (month: Date, [minYear, maxYear]: [number, number]): QuickCell[] => {
  const start = getYearPageStart(month.getFullYear());
  return Array.from({ length: YEARS_PER_PAGE }, (_, i) => {
    const year = start + i;
    return {
      key: String(year),
      label: String(year),
      value: year,
      selected: year === month.getFullYear(),
      disabled: year < minYear || year > maxYear,
    };
  });
};

export const chunkRows = <T>(cells: T[], columns = QUICK_GRID_COLUMNS): T[][] =>
  Array.from({ length: Math.ceil(cells.length / columns) }, (_, i) => cells.slice(i * columns, (i + 1) * columns));

/** The month/year grid takes the same height as the day grid so the calendar never jumps. */
export const getQuickGridHeight = (dayHeight: number, fixedWeeks: boolean, showWeekdays: boolean) =>
  dayHeight * (fixedWeeks ? 6 : 5) + (showWeekdays ? WEEKDAY_ROW_HEIGHT : 0);

export const isHorizontalSwipe = (dx: number, dy: number) =>
  Math.abs(dx) > SWIPE.activateDistance && Math.abs(dx) > Math.abs(dy) * SWIPE.directionRatio;

/** Month delta for a released swipe: swiping left goes forward, mirrored in RTL; 0 when too short and slow. */
export const getSwipeDelta = (dx: number, vx: number, rtl: boolean) => {
  if (Math.abs(dx) <= SWIPE.minDistance && Math.abs(vx) <= SWIPE.minVelocity) return 0;
  const delta = dx < 0 ? 1 : -1;
  return rtl ? -delta : delta;
};
