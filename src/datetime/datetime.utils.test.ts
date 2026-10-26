import { toDateKey } from '../core/utils/date.utils';
import { formatDateTimeValue, formatDayLabel, getDayItems, getDayTimeBounds, getDayWheelBounds, withDay } from './datetime.utils';

const at = (d: number, h = 0, m = 0) => new Date(2026, 9, d, h, m);

describe('withDay', () => {
  it('moves the date and keeps the time', () => {
    const next = withDay(at(10, 14, 30), new Date(2027, 1, 3));
    expect(toDateKey(next)).toBe('2027-02-03');
    expect([next.getHours(), next.getMinutes()]).toEqual([14, 30]);
  });
  it('clamps to min/max moments', () => {
    expect(withDay(at(10, 8), at(12), at(12, 9)).getHours()).toBe(9);
    expect(withDay(at(10, 20), at(12), undefined, at(12, 18)).getHours()).toBe(18);
  });
});

describe('getDayTimeBounds', () => {
  it('limits the time only on the min and max days', () => {
    const min = at(10, 9);
    const max = at(12, 17);
    expect(getDayTimeBounds(at(10, 12), min, max)).toEqual({ minTime: min, maxTime: undefined });
    expect(getDayTimeBounds(at(11, 12), min, max)).toEqual({ minTime: undefined, maxTime: undefined });
    expect(getDayTimeBounds(at(12, 12), min, max)).toEqual({ minTime: undefined, maxTime: max });
  });
});

describe('getDayWheelBounds', () => {
  const today = at(26, 15);
  const keys = (bounds: [number, number]) => bounds.map((t) => toDateKey(new Date(t)));

  it('uses the min/max days', () => {
    expect(keys(getDayWheelBounds(at(20), at(1, 9), at(31, 9), today))).toEqual(['2026-10-01', '2026-10-31']);
  });
  it('defaults to a year either side of today', () => {
    expect(keys(getDayWheelBounds(today, undefined, undefined, today))).toEqual(['2025-10-26', '2027-10-26']);
  });
  it('widens to hold a date outside the default span', () => {
    expect(keys(getDayWheelBounds(new Date(2020, 0, 1), undefined, undefined, today))[0]).toBe('2020-01-01');
  });
});

describe('day labels', () => {
  it('calls today Today', () => {
    expect(formatDayLabel(at(26, 9), 'en-US', at(26, 15))).toBe('Today');
  });
  it('formats other days by locale', () => {
    expect(formatDayLabel(at(27), 'en-US', at(26))).toBe('Tue, Oct 27');
  });
  it('lists every day inclusively', () => {
    const items = getDayItems([at(30).getTime(), new Date(2026, 10, 2).getTime()], (d) => toDateKey(d));
    expect(items.map((item) => item.label)).toEqual(['2026-10-30', '2026-10-31', '2026-11-01', '2026-11-02']);
  });
});

describe('formatDateTimeValue', () => {
  it('shows the date and the time in the chosen format', () => {
    expect(formatDateTimeValue(at(26, 21, 5), { format: '24h', locale: 'en-US' })).toBe('Oct 26, 2026, 21:05');
    expect(formatDateTimeValue(at(26, 21, 5), { locale: 'en-US' })).toMatch(/^Oct 26, 2026, 9:05\sPM$/);
  });
});
