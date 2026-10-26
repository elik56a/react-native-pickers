import { toDateKey } from '../core/utils/date.utils';
import {
  buildWheelDate,
  formatDateValue,
  getDateColumnSpecs,
  getEmptyDraft,
  getLocaleDateOrder,
  getWheelYearBounds,
  isDraftReady,
} from './date.utils';

const day = (d: number, m: number, y = 2026) => new Date(y, m, d);

describe('getLocaleDateOrder', () => {
  it('follows how the locale writes dates', () => {
    expect(getLocaleDateOrder('en-US')).toEqual(['month', 'day', 'year']);
    expect(getLocaleDateOrder('en-GB')).toEqual(['day', 'month', 'year']);
  });
  it('falls back for unknown locales', () => {
    expect(getLocaleDateOrder('not a locale')).toEqual(['month', 'day', 'year']);
  });
});

describe('buildWheelDate', () => {
  it('replaces parts and keeps the time', () => {
    const start = new Date(2026, 0, 15, 9, 30);
    const next = buildWheelDate(start, { month: 5, year: 2030 });
    expect(toDateKey(next)).toBe('2030-06-15');
    expect(next.getHours()).toBe(9);
  });
  it('shrinks the day to fit a shorter month', () => {
    expect(toDateKey(buildWheelDate(day(31, 0), { month: 1 }))).toBe('2026-02-28');
  });
  it('clamps to min/max', () => {
    expect(toDateKey(buildWheelDate(day(15, 5), { month: 0 }, day(1, 2)))).toBe('2026-03-01');
  });
});

describe('getWheelYearBounds', () => {
  const now = day(1, 0);
  it('prefers min/max dates over yearRange', () => {
    expect(getWheelYearBounds(now, [2000, 2010], day(1, 0, 1990))).toEqual([1990, 2010]);
  });
  it('defaults to 100 years either side', () => {
    expect(getWheelYearBounds(now)).toEqual([1926, 2126]);
  });
});

describe('getDateColumnSpecs', () => {
  const base = {
    date: day(10, 1, 2024),
    locale: 'en-US',
    monthFormat: 'long' as const,
    years: [2020, 2030] as [number, number],
    loop: true,
  };

  it('lists the days of the shown month', () => {
    const { day: days } = getDateColumnSpecs(base);
    expect(days.items).toHaveLength(29);
    expect(days.value).toBe(10);
  });
  it('labels months by format', () => {
    expect(getDateColumnSpecs(base).month.items[0]).toMatchObject({ label: 'January' });
    expect(getDateColumnSpecs({ ...base, monthFormat: 'numeric' }).month.items[0]).toMatchObject({ label: '01' });
    expect(getDateColumnSpecs({ ...base, monthFormat: 'numeric' }).day.items[0]).toMatchObject({ label: '01' });
  });
  it('disables days and months outside min/max', () => {
    const specs = getDateColumnSpecs({ ...base, minDate: day(5, 1, 2024), maxDate: day(20, 4, 2024) });
    const disabledDays = specs.day.items.filter((it) => typeof it === 'object' && it.disabled).length;
    expect(disabledDays).toBe(4);
    const disabledMonths = specs.month.items.flatMap((it) => (typeof it === 'object' && it.disabled ? [it.value] : []));
    expect(disabledMonths).toEqual([0, 5, 6, 7, 8, 9, 10, 11]);
  });
  it('lists the year bounds inclusively', () => {
    expect(getDateColumnSpecs(base).year.items).toHaveLength(11);
  });
});

describe('date sheet drafts', () => {
  it('starts each mode empty, except the wheel which needs a date', () => {
    expect(getEmptyDraft('single', 'calendar')).toBeNull();
    expect(getEmptyDraft('range', 'calendar')).toEqual({ start: null, end: null });
    expect(getEmptyDraft('multiple', 'calendar')).toEqual([]);
    expect(getEmptyDraft('single', 'wheel')).toBeInstanceOf(Date);
  });
  it('is ready once the mode has what it needs', () => {
    expect(isDraftReady('single', null)).toBe(false);
    expect(isDraftReady('single', new Date())).toBe(true);
    expect(isDraftReady('range', { start: new Date(), end: null })).toBe(false);
    expect(isDraftReady('range', { start: new Date(), end: new Date() })).toBe(true);
    expect(isDraftReady('multiple', [])).toBe(true);
  });
});

describe('formatDateValue', () => {
  it('formats a date, a range and a list', () => {
    expect(formatDateValue(day(5, 9), 'en-US')).toBe('Oct 5, 2026');
    expect(formatDateValue({ start: day(5, 9), end: day(9, 9) }, 'en-US')).toBe('Oct 5, 2026 – Oct 9, 2026');
    expect(formatDateValue([day(5, 9), day(7, 9)], 'en-US')).toBe('Oct 5, 2026, Oct 7, 2026');
  });

  it('shows a range start before its end is picked', () => {
    expect(formatDateValue({ start: day(5, 9), end: null }, 'en-US')).toBe('Oct 5, 2026');
  });

  it('is empty without a value', () => {
    expect(formatDateValue(null)).toBe('');
    expect(formatDateValue(undefined)).toBe('');
    expect(formatDateValue({ start: null, end: null })).toBe('');
    expect(formatDateValue([])).toBe('');
  });
});
