import { lightTheme } from '../core';
import { buildMonthGrid, toDateKey } from '../core/utils/date.utils';
import { CALENDAR_DESIGN, EMPTY_RANGE } from './calendar.constants';
import type { CalendarSelection, DayState } from './calendar.types';
import {
  canGoToMonth,
  canGoToWeek,
  chunkRows,
  getAnchorMonth,
  getArrowGlyph,
  getCollapseDate,
  getDayLook,
  getDayState,
  getDayTextColor,
  getDragProgress,
  getExpandMonth,
  getHeaderLabel,
  getMonthCells,
  getPresetItems,
  getQuickGridHeight,
  getRangePresets,
  getStripWeek,
  getWeekDays,
  getWeekMonth,
  getWeekRow,
  getWeekStart,
  getWeekStates,
  getYearBounds,
  getYearCells,
  getYearPageLabel,
  hasRangeEnd,
  isDayDisabled,
  isSameRange,
  nextRange,
  nextRanges,
  orderWeekdays,
  rangeContains,
  rangeCrossesDisabled,
  shiftMonthForView,
  shouldExpand,
  showsRangeBand,
  toggleMultiple,
} from './calendar.utils';

const day = (d: number, m = 9, y = 2026) => new Date(y, m, d);
const keys = (dates: Date[]) => dates.map(toDateKey);
const none = () => false;
const selection = (patch: Partial<CalendarSelection>): CalendarSelection => ({
  mode: 'single',
  single: null,
  range: EMPTY_RANGE,
  multiple: [],
  ranges: [],
  ...patch,
});

describe('isDayDisabled', () => {
  it('combines min/max, the callback and marked dates', () => {
    const rules = {
      minDate: day(5),
      maxDate: day(25),
      isDateDisabled: (d: Date) => d.getDay() === 6,
      markedDates: { '2026-10-14': { disabled: true } },
    };
    expect(isDayDisabled(day(4), rules)).toBe(true);
    expect(isDayDisabled(day(26), rules)).toBe(true);
    expect(isDayDisabled(day(10), rules)).toBe(true); // Saturday
    expect(isDayDisabled(day(14), rules)).toBe(true);
    expect(isDayDisabled(day(13), rules)).toBe(false);
  });
});

describe('rangeCrossesDisabled', () => {
  it('checks every day before the end', () => {
    const blocked = (d: Date) => d.getDate() === 12;
    expect(rangeCrossesDisabled(day(10), day(14), blocked)).toBe(true);
    expect(rangeCrossesDisabled(day(10), day(12), blocked)).toBe(false);
  });
});

describe('nextRange', () => {
  const open = { start: day(10), end: null };

  it('starts a range from nothing, after a complete range, or before the start', () => {
    expect(nextRange(EMPTY_RANGE, day(10), {}, none)).toEqual({ start: day(10), end: null });
    expect(nextRange({ start: day(1), end: day(3) }, day(10), {}, none)).toEqual({ start: day(10), end: null });
    expect(nextRange(open, day(8), {}, none)).toEqual({ start: day(8), end: null });
  });
  it('completes an open range', () => {
    expect(nextRange(open, day(14), {}, none)).toEqual({ start: day(10), end: day(14) });
  });
  it('allows a single-day range unless turned off', () => {
    expect(nextRange(open, day(10), {}, none)).toEqual({ start: day(10), end: day(10) });
    expect(nextRange(open, day(10), { allowSingleDayRange: false }, none)).toBeNull();
  });
  it('ignores ends that are too close', () => {
    expect(nextRange(open, day(11), { minRangeDays: 2 }, none)).toBeNull();
    expect(nextRange(open, day(12), { minRangeDays: 2 }, none)).toEqual({ start: day(10), end: day(12) });
  });
  it('restarts when the range would be too long', () => {
    expect(nextRange(open, day(20), { maxRangeDays: 7 }, none)).toEqual({ start: day(20), end: null });
  });
  it('restarts when the range would cross a disabled day', () => {
    expect(nextRange(open, day(14), {}, (d) => d.getDate() === 12)).toEqual({ start: day(14), end: null });
  });
});

describe('rangeContains', () => {
  it('includes both ends, and an open range holds only its start', () => {
    expect(rangeContains({ start: day(10), end: day(12) }, day(10))).toBe(true);
    expect(rangeContains({ start: day(10), end: day(12) }, day(11))).toBe(true);
    expect(rangeContains({ start: day(10), end: day(12) }, day(13))).toBe(false);
    expect(rangeContains({ start: day(10), end: null }, day(10))).toBe(true);
    expect(rangeContains({ start: day(10), end: null }, day(11))).toBe(false);
  });
});

describe('nextRanges', () => {
  const first = { start: day(3), end: day(5) };

  it('starts, completes and sorts ranges', () => {
    const opened = nextRanges([first], day(20), {}, none) ?? [];
    expect(opened).toEqual([first, { start: day(20), end: null }]);
    const added = nextRanges([{ start: day(20), end: day(22) }], day(1), {}, none) ?? [];
    expect(nextRanges(added, day(2), {}, none)).toEqual([
      { start: day(1), end: day(2) },
      { start: day(20), end: day(22) },
    ]);
  });
  it('removes a finished range when one of its days is tapped', () => {
    expect(nextRanges([first, { start: day(10), end: null }], day(4), {}, none)).toEqual([{ start: day(10), end: null }]);
  });
  it('restarts instead of overlapping another range', () => {
    expect(nextRanges([first, { start: day(1), end: null }], day(8), {}, none)).toEqual([first, { start: day(8), end: null }]);
  });
  it('applies the range rules to the open range', () => {
    expect(nextRanges([{ start: day(10), end: null }], day(11), { minRangeDays: 2 }, none)).toBeNull();
  });
  it('refuses a new range past maxRanges but still removes and completes', () => {
    expect(nextRanges([first], day(10), { maxRanges: 1 }, none)).toBeNull();
    expect(nextRanges([first], day(5), { maxRanges: 1 }, none)).toEqual([]);
    expect(nextRanges([{ start: day(10), end: null }], day(12), { maxRanges: 1 }, none)).toEqual([{ start: day(10), end: day(12) }]);
  });
});

describe('range presets', () => {
  it('counts each preset back from today, including a month that spans a year', () => {
    const presets = getRangePresets(new Date(2026, 0, 10, 15, 30));
    expect(presets.map(({ label, start, end }) => [label, toDateKey(start), toDateKey(end)])).toEqual([
      ['Today', '2026-01-10', '2026-01-10'],
      ['Yesterday', '2026-01-09', '2026-01-09'],
      ['Last 7 days', '2026-01-04', '2026-01-10'],
      ['Last 30 days', '2025-12-12', '2026-01-10'],
      ['This month', '2026-01-01', '2026-01-10'],
      ['Last month', '2025-12-01', '2025-12-31'],
    ]);
  });

  it('matches ranges by day, ignoring the time', () => {
    expect(isSameRange({ start: day(1), end: new Date(2026, 9, 7, 18) }, { start: day(1), end: day(7) })).toBe(true);
    expect(isSameRange({ start: day(1), end: null }, { start: day(1), end: day(7) })).toBe(false);
  });

  it('disables a preset the calendar would not let you pick', () => {
    const presets = [
      { label: 'Fits', start: day(1), end: day(7) },
      { label: 'Ends after max', start: day(25), end: day(31) },
      { label: 'Crosses a disabled day', start: day(8), end: day(12) },
      { label: 'Too long', start: day(1), end: day(20) },
      { label: 'One day', start: day(3), end: day(3) },
    ];
    const isDisabled = (d: Date) => d > day(30) || toDateKey(d) === '2026-10-10';
    const items = getPresetItems(presets, { maxRangeDays: 10, allowSingleDayRange: false }, isDisabled);
    expect(items.map((item) => [item.label, item.disabled])).toEqual([
      ['Fits', false],
      ['Ends after max', true],
      ['Crosses a disabled day', true],
      ['Too long', true],
      ['One day', true],
    ]);
  });
});

describe('toggleMultiple', () => {
  it('adds in date order and removes existing days', () => {
    expect(keys(toggleMultiple([day(20)], day(5)) ?? [])).toEqual(['2026-10-05', '2026-10-20']);
    expect(keys(toggleMultiple([day(5), day(20)], day(5)) ?? [])).toEqual(['2026-10-20']);
  });
  it('refuses to add past the maximum but still removes', () => {
    expect(toggleMultiple([day(1), day(2)], day(3), 2)).toBeNull();
    expect(keys(toggleMultiple([day(1), day(2)], day(2), 2) ?? [])).toEqual(['2026-10-01']);
  });
});

describe('getAnchorMonth', () => {
  it('prefers initialMonth, then the selection', () => {
    expect(getAnchorMonth(day(20, 2), selection({ single: day(5) }))).toEqual(day(1, 2));
    expect(getAnchorMonth(undefined, selection({ single: day(5, 4) }))).toEqual(day(1, 4));
    expect(getAnchorMonth(undefined, selection({ range: { start: day(5, 6), end: null } }))).toEqual(day(1, 6));
    expect(getAnchorMonth(undefined, selection({ multiple: [day(5, 7)] }))).toEqual(day(1, 7));
    expect(getAnchorMonth(undefined, selection({ ranges: [{ start: day(5, 8), end: null }] }))).toEqual(day(1, 8));
  });
});

describe('getDayState / getWeekStates', () => {
  const base = { month: day(1), today: day(15), isDisabled: none };

  it('marks single selection, today and outside days', () => {
    const sel = selection({ single: day(15) });
    expect(getDayState({ ...base, selection: sel, date: day(15) })).toMatchObject({ selected: true, today: true, outside: false });
    expect(getDayState({ ...base, selection: sel, date: day(30, 8) }).outside).toBe(true);
  });
  it('marks range ends and the days between', () => {
    const sel = selection({ mode: 'range', range: { start: day(10), end: day(13) } });
    expect(getDayState({ ...base, selection: sel, date: day(10) })).toMatchObject({ selected: true, rangeStart: true, inRange: false });
    expect(getDayState({ ...base, selection: sel, date: day(11) })).toMatchObject({ selected: false, inRange: true });
    expect(getDayState({ ...base, selection: sel, date: day(13) })).toMatchObject({ selected: true, rangeEnd: true });
  });
  it('marks the ends and days of each finished range in ranges mode', () => {
    const sel = selection({
      mode: 'ranges',
      ranges: [
        { start: day(3), end: day(5) },
        { start: day(20), end: null },
      ],
    });
    expect(getDayState({ ...base, selection: sel, date: day(3) })).toMatchObject({ selected: true, rangeStart: true });
    expect(getDayState({ ...base, selection: sel, date: day(4) })).toMatchObject({ selected: false, inRange: true });
    expect(getDayState({ ...base, selection: sel, date: day(5) })).toMatchObject({ selected: true, rangeEnd: true });
    expect(getDayState({ ...base, selection: sel, date: day(20) })).toMatchObject({
      selected: true,
      rangeStart: false,
      inRange: false,
      ranged: true,
    });
  });
  it('marks every day in multiple mode and attaches markings', () => {
    const sel = selection({ mode: 'multiple', multiple: [day(3), day(9)] });
    const marked = { '2026-10-09': { label: '$89' } };
    expect(getDayState({ ...base, selection: sel, date: day(9), markedDates: marked })).toMatchObject({
      selected: true,
      marking: { label: '$89' },
    });
  });
  it('maps a whole month grid', () => {
    const weeks = getWeekStates(buildMonthGrid(2026, 9, 0), { ...base, selection: selection({}) });
    expect(weeks).toHaveLength(6);
    expect(weeks.flat().filter((s) => s.today)).toHaveLength(1);
  });
});

describe('showsRangeBand / getDayTextColor', () => {
  const state = (patch: Partial<DayState>): DayState => ({
    date: day(1),
    selected: false,
    rangeStart: false,
    rangeEnd: false,
    inRange: false,
    ranged: false,
    today: false,
    disabled: false,
    outside: false,
    ...patch,
  });
  const c = lightTheme.colors;

  it('paints the band inside and at the ends of a complete range only', () => {
    expect(showsRangeBand(state({ inRange: true }), true)).toBe(true);
    expect(showsRangeBand(state({ rangeStart: true }), true)).toBe(true);
    expect(showsRangeBand(state({ rangeStart: true }), false)).toBe(false);
    expect(showsRangeBand(state({ rangeStart: true, rangeEnd: true }), true)).toBe(false);
  });
  it('hides the band only for an open range in range mode', () => {
    expect(hasRangeEnd(selection({ mode: 'range', range: { start: day(1), end: null } }))).toBe(false);
    expect(hasRangeEnd(selection({ mode: 'range', range: { start: day(1), end: day(2) } }))).toBe(true);
    expect(hasRangeEnd(selection({ mode: 'ranges' }))).toBe(true);
  });
  it('picks the day text colour by priority', () => {
    expect(getDayTextColor(state({ selected: true, disabled: true }), c)).toBe(c.onPrimary);
    expect(getDayTextColor(state({ disabled: true, marking: { textColor: 'red' } }), c)).toBe(c.textDisabled);
    expect(getDayTextColor(state({ outside: true, marking: { textColor: 'red' } }), c)).toBe('red');
    expect(getDayTextColor(state({ outside: true }), c)).toBe(c.textDisabled);
    expect(getDayTextColor(state({ today: true }), c)).toBe(c.primary);
    expect(getDayTextColor(state({}), c)).toBe(c.text);
    expect(getDayTextColor(state({ selected: true }), c, true)).toBe(c.primary);
  });
  it('tints the chosen day on iOS but fills range ends, rings today in Material and shades it on the web', () => {
    expect(getDayLook(state({ selected: true }), CALENDAR_DESIGN.ios)).toMatchObject({ tinted: true, filled: false });
    expect(getDayLook(state({ selected: true, ranged: true }), CALENDAR_DESIGN.ios)).toMatchObject({ tinted: false, filled: true });
    expect(getDayLook(state({ selected: true }), CALENDAR_DESIGN.material)).toMatchObject({ tinted: false, filled: true });
    expect(getDayLook(state({ today: true }), CALENDAR_DESIGN.material)).toMatchObject({ todayRing: true, todaySurface: false });
    expect(getDayLook(state({ today: true }), CALENDAR_DESIGN.web)).toMatchObject({ todayRing: false, todaySurface: true });
    expect(getDayLook(state({ today: true, selected: true }), CALENDAR_DESIGN.web)).toMatchObject({ todaySurface: false, filled: true });
    expect(getDayLook(state({ today: true, inRange: true }), CALENDAR_DESIGN.web)).toMatchObject({ todaySurface: false });
  });
});

describe('navigation helpers', () => {
  it('orders weekday names from the first day of the week', () => {
    const weekdays = orderWeekdays(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'], 1);
    expect(weekdays.map((w) => w.label)).toEqual(['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']);
    expect(weekdays.map((w) => w.key)).toEqual([1, 2, 3, 4, 5, 6, 0]);
  });
  it('points arrows the right way in LTR and RTL', () => {
    expect(getArrowGlyph('prev', false)).toBe('‹');
    expect(getArrowGlyph('next', false)).toBe('›');
    expect(getArrowGlyph('prev', true)).toBe('›');
  });
  it('blocks months outside min/max', () => {
    expect(canGoToMonth(day(1), -1, day(20))).toBe(false);
    expect(canGoToMonth(day(1), -1, day(20, 8))).toBe(true);
    expect(canGoToMonth(day(1), 1, undefined, day(31))).toBe(false);
    expect(canGoToMonth(day(1), 1, undefined, day(1, 10))).toBe(true);
  });
  it('pages by a year in the month view and by 12 years in the year view', () => {
    expect(shiftMonthForView('months', day(15), 1)).toEqual(day(1, 9, 2027));
    expect(shiftMonthForView('years', day(15), -1)).toEqual(day(1, 9, 2014));
  });
  it('labels the header for each view', () => {
    expect(getHeaderLabel('days', day(1), 'October 2026')).toBe('October 2026');
    expect(getHeaderLabel('months', day(1), 'October 2026')).toBe('2026');
    expect(getHeaderLabel('years', day(1), 'October 2026')).toBe('2016 – 2027');
    expect(getYearPageLabel(2016)).toBe('2016 – 2027');
  });
});

describe('quick grid cells', () => {
  const names = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

  it('disables months entirely outside min/max', () => {
    const cells = getMonthCells(day(15), names, day(15, 2), day(1, 10));
    expect(cells.map((c) => c.disabled)).toEqual([true, true, false, false, false, false, false, false, false, false, false, true]);
    expect(cells.find((c) => c.selected)?.value).toBe(9);
  });
  it('lists a page of 12 years within bounds', () => {
    const cells = getYearCells(day(1), [2020, 2030]);
    expect(cells.map((c) => c.value)).toEqual([2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027]);
    expect(cells.filter((c) => c.disabled).map((c) => c.value)).toEqual([2016, 2017, 2018, 2019]);
    expect(cells.find((c) => c.selected)?.value).toBe(2026);
  });
  it('bounds years by yearRange, else ±100 years, within min/max', () => {
    expect(getYearBounds(day(1), [2000, 2010], day(1, 0, 1990))).toEqual([2000, 2010]);
    expect(getYearBounds(day(1), [2000, 2010], day(1, 0, 2005))).toEqual([2005, 2010]);
    expect(getYearBounds(day(1), undefined, day(1, 0, 1990))).toEqual([1990, 2126]);
    expect(getYearBounds(day(1), undefined, undefined, day(1, 0, 2030))).toEqual([1926, 2030]);
  });
  it('keeps min/max when yearRange misses them', () => {
    expect(getYearBounds(day(1), [2000, 2010], day(1, 0, 2020))).toEqual([2020, 2020]);
  });
  it('splits cells into rows of three', () => {
    expect(chunkRows([1, 2, 3, 4, 5, 6, 7])).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
  });
  it('matches the day grid height', () => {
    expect(getQuickGridHeight(44, true, true)).toBe(44 * 6 + 28);
    expect(getQuickGridHeight(44, false, false)).toBe(44 * 5);
  });
});

describe('weeks', () => {
  const wed = new Date(2026, 9, 28, 15, 30);

  it('starts the week on the locale day, at midnight', () => {
    expect(getWeekStart(wed, 0)).toEqual(new Date(2026, 9, 25));
    expect(getWeekStart(wed, 1)).toEqual(new Date(2026, 9, 26));
    expect(getWeekStart(new Date(2026, 9, 25), 1)).toEqual(new Date(2026, 9, 19));
    expect(getWeekDays(new Date(2026, 9, 25)).map((d) => d.getDate())).toEqual([25, 26, 27, 28, 29, 30, 31]);
  });

  it('pages to a week while any of its days is within min/max', () => {
    const start = new Date(2026, 9, 25);
    expect(canGoToWeek(start, -1, new Date(2026, 9, 24))).toBe(true);
    expect(canGoToWeek(start, -1, new Date(2026, 9, 25))).toBe(false);
    expect(canGoToWeek(start, 1, undefined, new Date(2026, 10, 1))).toBe(true);
    expect(canGoToWeek(start, 1, undefined, new Date(2026, 9, 31))).toBe(false);
  });

  it("titles a week by its middle day's month", () => {
    expect(getWeekMonth(new Date(2026, 8, 29)).getMonth()).toBe(9);
  });
});

describe('expanding and collapsing', () => {
  it("opens a week into the selected day's month, else the month most of the week falls in", () => {
    const weekStart = day(27);
    expect(getExpandMonth(weekStart, day(1, 10))).toEqual(day(1, 10));
    expect(getExpandMonth(weekStart, null)).toEqual(day(1));
    expect(getExpandMonth(day(29), null)).toEqual(day(1, 10));
  });

  it('folds a month into the selected day, else today, else the 1st', () => {
    expect(getCollapseDate(day(1), day(14), day(20))).toEqual(day(14));
    expect(getCollapseDate(day(1), day(14, 8), day(20))).toEqual(day(20));
    expect(getCollapseDate(day(1), null, day(3, 11))).toEqual(day(1));
  });

  it('finds the week row of a month grid', () => {
    const grid = buildMonthGrid(2026, 9, 0);
    expect(getWeekRow(grid, day(18))).toBe(3);
    expect(getWeekRow(grid, day(1, 5))).toBe(0);
  });

  it('builds a strip week where no day is outside', () => {
    const week = getStripWeek(day(27, 8), { today: day(1), selection: selection({}), isDisabled: () => false });
    expect(week).toHaveLength(7);
    expect(week.some((d) => d.outside)).toBe(false);
    expect(week[4]?.today).toBe(true);
  });

  it('follows a drag between folded and open, and lands where it was flung or once dragged past the commit point', () => {
    expect(getDragProgress(0, 66, 132)).toBe(0.5);
    expect(getDragProgress(1, -500, 132)).toBe(0);
    expect(getDragProgress(0, 500, 132)).toBe(1);
    expect(shouldExpand(0.1, 1.2, 0)).toBe(true);
    expect(shouldExpand(0.9, -1.2, 1)).toBe(false);
    expect(shouldExpand(0.2, 0, 0)).toBe(true);
    expect(shouldExpand(0.1, 0.1, 0)).toBe(false);
    expect(shouldExpand(0.8, 0, 1)).toBe(false);
    expect(shouldExpand(0.9, 0, 1)).toBe(true);
  });
});
