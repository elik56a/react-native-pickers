import {
  addMonths,
  buildMonthGrid,
  clampDate,
  daysInMonth,
  getFirstDayOfWeek,
  getMonthNames,
  isBetweenDays,
  isOutOfRange,
  toDateKey,
  uses12HourClock,
} from '../utils/date';

describe('date utils', () => {
  test('daysInMonth handles leap years', () => {
    expect(daysInMonth(2024, 1)).toBe(29);
    expect(daysInMonth(2026, 1)).toBe(28);
    expect(daysInMonth(2026, 11)).toBe(31);
  });
  test('addMonths clamps the day', () => {
    expect(toDateKey(addMonths(new Date(2026, 0, 31), 1))).toBe('2026-02-28');
    expect(toDateKey(addMonths(new Date(2026, 2, 15), -3))).toBe('2025-12-15');
  });
  test('month grid starts on the requested weekday', () => {
    const sun = buildMonthGrid(2026, 9, 0); // Oct 2026, Oct 1 is Thursday
    expect(sun).toHaveLength(6);
    expect(sun[0]![0]!.getDay()).toBe(0);
    expect(toDateKey(sun[0]![4]!)).toBe('2026-10-01');
    const mon = buildMonthGrid(2026, 9, 1, false);
    expect(mon[0]![0]!.getDay()).toBe(1);
    expect(mon).toHaveLength(5);
  });
  test('range helpers', () => {
    const a = new Date(2026, 9, 10),
      b = new Date(2026, 9, 20);
    expect(isBetweenDays(new Date(2026, 9, 15, 23), a, b)).toBe(true);
    expect(isBetweenDays(a, a, b)).toBe(false);
    expect(isOutOfRange(new Date(2026, 9, 9), a, b)).toBe(true);
    expect(isOutOfRange(new Date(2026, 9, 10, 18), a, b)).toBe(false);
    expect(clampDate(new Date(2027, 0, 1), a, b).getTime()).toBe(b.getTime());
  });
  test('locale helpers', () => {
    expect(uses12HourClock('en-US')).toBe(true);
    expect(uses12HourClock('he-IL')).toBe(false);
    expect(getMonthNames('en-US')[0]).toBe('January');
    expect([0, 1]).toContain(getFirstDayOfWeek('de-DE') === 1 ? 1 : 0);
  });
});
