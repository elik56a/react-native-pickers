import type { PickerTheme } from '../core';
import { SWIPE } from '../core/core.constants';
import {
  addDays,
  addMonths,
  compareDay,
  isBetweenDays,
  isOutOfRange,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  toDateKey,
} from '../core/utils/date.utils';
import {
  ARROW_DIRECTION,
  CALENDAR_MODE,
  CALENDAR_VIEW,
  DAY_MS,
  DAY_SELECTION,
  DAYS_PER_WEEK,
  DEFAULT_YEAR_SPAN,
  EMPTY_RANGE,
  EXPAND_DRAG_COMMIT,
  MAX_DAY_SIZE,
  QUICK_GRID_COLUMNS,
  RANGE_PRESET_LABELS,
  TODAY_MARK,
  WEEKDAY_ROW_HEIGHT,
  YEARS_PER_PAGE,
} from './calendar.constants';
import type {
  ArrowDirection,
  CalendarDesign,
  CalendarSelection,
  CalendarView,
  DateRange,
  DateRangePreset,
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

/** Today, yesterday, the last 7 and 30 days, this month so far and last month, counted back from `today`. */
export const getRangePresets = (today = new Date()): DateRangePreset[] => {
  const day = startOfDay(today);
  const month = startOfMonth(day);
  return [
    { label: RANGE_PRESET_LABELS.today, start: day, end: day },
    { label: RANGE_PRESET_LABELS.yesterday, start: addDays(day, -1), end: addDays(day, -1) },
    { label: RANGE_PRESET_LABELS.last7Days, start: addDays(day, -6), end: day },
    { label: RANGE_PRESET_LABELS.last30Days, start: addDays(day, -29), end: day },
    { label: RANGE_PRESET_LABELS.thisMonth, start: month, end: day },
    { label: RANGE_PRESET_LABELS.lastMonth, start: addMonths(month, -1), end: addDays(month, -1) },
  ];
};

export const isSameRange = (a: DateRange, b: DateRange) => isSameDay(a.start, b.start) && isSameDay(a.end, b.end);

/** The preset chips, each disabled unless tapping its two ends would pick it: within min/max, past no disabled day, and within the range rules. */
export const getPresetItems = (presets: DateRangePreset[], rules: RangeRules, isDisabled: (day: Date) => boolean) =>
  presets.map(({ label, start, end }) => ({
    label,
    value: {
      start,
      end,
    },
    disabled: isDisabled(start) || isDisabled(end) || !nextRange({ start, end: null }, end, rules, isDisabled)?.end,
  }));

/** Dates after toggling `day`, kept in order; null when adding would pass `maxSelections`. */
export const toggleMultiple = (dates: Date[], day: Date, maxSelections?: number): Date[] | null => {
  if (dates.some((d) => isSameDay(d, day))) return dates.filter((d) => !isSameDay(d, day));
  if (maxSelections !== undefined && dates.length >= maxSelections) return null;
  return [...dates, day].sort((a, b) => a.getTime() - b.getTime());
};

/** True when `day` is the start or end of `range`, or falls between them. */
export const rangeContains = (range: DateRange, day: Date) =>
  isSameDay(day, range.start) || isSameDay(day, range.end) || isBetweenDays(day, range.start, range.end);

/**
 * The ranges after tapping `day`, sorted by start, or null when the tap should be ignored.
 * Tapping a finished range removes it; any other tap builds the open range like `nextRange`.
 * Finished ranges count as disabled days, so ranges never overlap.
 */
export const nextRanges = (
  ranges: DateRange[],
  day: Date,
  rules: RangeRules & { maxRanges?: number },
  isDisabled: (day: Date) => boolean
): DateRange[] | null => {
  const finished = ranges.filter((r) => r.end);
  const tapped = finished.find((r) => rangeContains(r, day));
  if (tapped) return ranges.filter((r) => r !== tapped);

  const open = ranges.find((r) => !r.end);
  if (!open && rules.maxRanges !== undefined && finished.length >= rules.maxRanges) return null;
  const next = nextRange(open ?? EMPTY_RANGE, day, rules, (d) => isDisabled(d) || finished.some((r) => rangeContains(r, d)));
  if (!next) return null;
  return [...finished, next].sort((a, b) => (a.start?.getTime() ?? 0) - (b.start?.getTime() ?? 0));
};

export const getAnchorMonth = (initialMonth: Date | undefined, selection: CalendarSelection) =>
  startOfMonth(
    initialMonth ?? selection.single ?? selection.range.start ?? selection.multiple[0] ?? selection.ranges[0]?.start ?? new Date()
  );

/**
 * The range a day draws its ends and band from. In ranges mode that is the finished range holding the day,
 * so a range still waiting for its end shows only a selected start, never a band.
 */
const getDayRange = ({ mode, range, ranges }: CalendarSelection, day: Date) => {
  if (mode === CALENDAR_MODE.range) return range;
  if (mode === CALENDAR_MODE.ranges) return ranges.find((r) => r.end && rangeContains(r, day)) ?? EMPTY_RANGE;
  return EMPTY_RANGE;
};

const isDaySelected = ({ mode, single, multiple, ranges }: CalendarSelection, day: Date, dayRange: DateRange) => {
  if (mode === CALENDAR_MODE.single) return isSameDay(day, single);
  if (mode === CALENDAR_MODE.multiple) return multiple.some((d) => isSameDay(d, day));
  return isSameDay(day, dayRange.start) || isSameDay(day, dayRange.end) || ranges.some((r) => !r.end && isSameDay(day, r.start));
};

export const getDayState = (params: {
  date: Date;
  month: Date;
  today: Date;
  selection: CalendarSelection;
  isDisabled: (day: Date) => boolean;
  markedDates?: Record<string, MarkedDate>;
}): DayState => {
  const { date, month, today, selection, isDisabled, markedDates } = params;
  const dayRange = getDayRange(selection, date);
  return {
    date,
    outside: date.getMonth() !== month.getMonth(),
    today: isSameDay(date, today),
    disabled: isDisabled(date),
    rangeStart: isSameDay(date, dayRange.start),
    rangeEnd: isSameDay(date, dayRange.end),
    inRange: isBetweenDays(date, dayRange.start, dayRange.end),
    ranged: selection.mode === CALENDAR_MODE.range || selection.mode === CALENDAR_MODE.ranges,
    selected: isDaySelected(selection, date, dayRange),
    marking: markedDates?.[toDateKey(date)],
  };
};

/** Only an open range in range mode hides the band; every range drawn in ranges mode is finished. */
export const hasRangeEnd = ({ mode, range }: CalendarSelection) => mode === CALENDAR_MODE.ranges || !!range.end;

export const getWeekStates = (grid: Date[][], params: Omit<Parameters<typeof getDayState>[0], 'date'>) =>
  grid.map((week) => week.map((date) => getDayState({ ...params, date })));

/** A completed range paints a band behind its days; a one-day range has nothing to connect. */
export const showsRangeBand = (state: DayState, hasRangeEnd: boolean) =>
  state.inRange || (hasRangeEnd && (state.rangeStart || state.rangeEnd) && !(state.rangeStart && state.rangeEnd));

/** `tinted`: the chosen day is tinted rather than filled, so its number takes the primary colour. */
export const getDayTextColor = (state: DayState, colors: PickerTheme['colors'], tinted = false) => {
  if (state.selected) return tinted ? colors.primary : colors.onPrimary;
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
export const getArrowGlyph = (direction: ArrowDirection, rtl: boolean) => ((direction === ARROW_DIRECTION.prev) !== rtl ? '‹' : '›');

export const canGoToMonth = (month: Date, delta: number, minDate?: Date, maxDate?: Date) => {
  const target = addMonths(month, delta);
  if (delta < 0) return !minDate || compareDay(target, startOfMonth(minDate)) >= 0;
  return !maxDate || compareDay(target, startOfMonth(maxDate)) <= 0;
};

/** Arrows page by month in the day view, by year in the month view and by 12 years in the year view. */
export const shiftMonthForView = (view: Exclude<CalendarView, typeof CALENDAR_VIEW.days>, month: Date, delta: number) => {
  const years = view === CALENDAR_VIEW.months ? delta : delta * YEARS_PER_PAGE;
  return new Date(month.getFullYear() + years, month.getMonth(), 1);
};

export const getYearPageStart = (year: number) => Math.floor(year / YEARS_PER_PAGE) * YEARS_PER_PAGE;

export const getYearPageLabel = (year: number) => {
  const start = getYearPageStart(year);
  return `${start} – ${start + YEARS_PER_PAGE - 1}`;
};

export const getHeaderLabel = (view: CalendarView, month: Date, title: string) => {
  if (view === CALENDAR_VIEW.years) return getYearPageLabel(month.getFullYear());
  if (view === CALENDAR_VIEW.months) return String(month.getFullYear());
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

/** How a day is drawn in the design: tinted or filled when chosen (range ends always filled), and how today is marked. */
export const getDayLook = (state: DayState, design: CalendarDesign) => {
  const tinted = state.selected && design.selection === DAY_SELECTION.tint && !state.ranged;
  return {
    tinted,
    filled: state.selected && !tinted,
    todayRing: !state.selected && state.today && design.today === TODAY_MARK.ring,
    // An opaque square would cut a hole in the range band.
    todaySurface: !state.selected && !state.inRange && state.today && design.today === TODAY_MARK.surface,
  };
};

/** The first day of the week holding `date`, at midnight. */
export const getWeekStart = (date: Date, firstDayOfWeek: number) =>
  addDays(startOfDay(date), -((date.getDay() - firstDayOfWeek + DAYS_PER_WEEK) % DAYS_PER_WEEK));

export const getWeekDays = (weekStart: Date) => Array.from({ length: DAYS_PER_WEEK }, (_, i) => addDays(weekStart, i));

/** A week can be shown while any of its days is within min/max. */
export const canGoToWeek = (weekStart: Date, delta: number, minDate?: Date, maxDate?: Date) => {
  const target = addDays(weekStart, delta * DAYS_PER_WEEK);
  if (delta < 0) return !minDate || compareDay(addDays(target, DAYS_PER_WEEK - 1), minDate) >= 0;
  return !maxDate || compareDay(target, maxDate) <= 0;
};

/** The month most of a week falls in, which is its middle day's: a week from Sep 29 to Oct 5 is October's. */
export const getWeekMonth = (weekStart: Date) => addDays(weekStart, Math.floor(DAYS_PER_WEEK / 2));

/** One week's days for a strip: each day is its own month, so none is dimmed as outside it. */
export const getStripWeek = (weekStart: Date, params: Omit<Parameters<typeof getDayState>[0], 'date' | 'month'>) =>
  getWeekDays(weekStart).map((date) => getDayState({ ...params, date, month: date }));

/** The month a week opens into: the selected day's when it's in the week, else the month most of the week falls in. */
export const getExpandMonth = (weekStart: Date, selected: Date | null) =>
  startOfMonth(selected && getWeekDays(weekStart).some((day) => isSameDay(day, selected)) ? selected : getWeekMonth(weekStart));

/** The day whose week a month folds into: the selected day, else today, when in the month, else the 1st. */
export const getCollapseDate = (month: Date, selected: Date | null, today: Date) => {
  if (selected && isSameMonth(selected, month)) return selected;
  return isSameMonth(today, month) ? today : startOfMonth(month);
};

/** The row of a month grid that starts on `weekStart`, or the first. */
export const getWeekRow = (grid: Date[][], weekStart: Date) =>
  Math.max(
    0,
    grid.findIndex((week) => isSameDay(week[0] ?? null, weekStart))
  );

/** How open a month is while dragged: where the drag started, moved by `dy` over the height it opens by. */
export const getDragProgress = (from: number, dy: number, travel: number) => Math.min(1, Math.max(0, from + (travel ? dy / travel : 0)));

/** Where a drag lands: the way it was flung, else the other end once dragged past `EXPAND_DRAG_COMMIT` of the way from `from`. */
export const shouldExpand = (progress: number, vy: number, from: number) => {
  if (Math.abs(vy) > SWIPE.minVelocity) return vy > 0;
  return from < 0.5 ? progress > EXPAND_DRAG_COMMIT : progress > 1 - EXPAND_DRAG_COMMIT;
};
