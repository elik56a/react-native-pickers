import {
  buildTime,
  clampTimeOfDay,
  getHourItems,
  getMinuteItems,
  getPeriodItems,
  getSecondItems,
  getTimeBounds,
  getTimeColumnSpecs,
  getTimeParts,
  getTimeSeparator,
  is12HourFormat,
  pad2,
  secondsOfDay,
  steps,
} from './time.utils';

const at = (h: number, m = 0, s = 0) => new Date(2026, 9, 25, h, m, s);
const hhmmss = (d: Date) => [d.getHours(), d.getMinutes(), d.getSeconds()].map(pad2).join(':');
const ALL_DAY = getTimeBounds();
const disabledValues = (items: { value: number; disabled?: boolean }[]) => items.filter((it) => it.disabled).map((it) => it.value);

describe('basics', () => {
  it('pads, steps and counts seconds', () => {
    expect(pad2(5)).toBe('05');
    expect(steps(60, 15)).toEqual([0, 15, 30, 45]);
    expect(steps(10, 4)).toEqual([0, 4, 8]);
    expect(secondsOfDay(at(1, 2, 3))).toBe(3723);
  });
  it('resolves the clock format', () => {
    expect(is12HourFormat('12h')).toBe(true);
    expect(is12HourFormat('24h', 'en-US')).toBe(false);
    expect(is12HourFormat('auto', 'en-US')).toBe(true);
    expect(is12HourFormat('auto', 'he-IL')).toBe(false);
  });
  it('defaults bounds to the whole day', () => {
    expect(ALL_DAY).toEqual([0, 86399]);
    expect(getTimeBounds(at(9, 30), at(17))).toEqual([34200, 61200]);
  });
});

describe('getTimeParts / buildTime', () => {
  it('snaps minutes and seconds down to their intervals', () => {
    expect(getTimeParts(at(10, 37, 59), 15, 10)).toEqual({ hours: 10, minutes: 30, seconds: 50 });
  });
  it('patches parts and keeps the date', () => {
    const parts = getTimeParts(at(10, 30, 20), 1, 1);
    const next = buildTime(at(10, 30, 20), parts, { minutes: 45 }, true);
    expect(hhmmss(next)).toBe('10:45:20');
    expect(next.getDate()).toBe(25);
  });
  it('zeroes seconds when they are hidden', () => {
    const parts = getTimeParts(at(10, 30, 20), 1, 1);
    expect(hhmmss(buildTime(at(10, 30, 20), parts, { hours: 11 }, false))).toBe('11:30:00');
  });
});

describe('clampTimeOfDay', () => {
  const bounds = getTimeBounds(at(9, 30), at(17, 15, 40));
  it('leaves times inside the bounds alone', () => {
    const inside = at(12);
    expect(clampTimeOfDay(inside, bounds, false)).toBe(inside);
  });
  it('pulls times up to the minimum and down to the maximum', () => {
    expect(hhmmss(clampTimeOfDay(at(8), bounds, false))).toBe('09:30:00');
    expect(hhmmss(clampTimeOfDay(at(18), bounds, true))).toBe('17:15:40');
    expect(hhmmss(clampTimeOfDay(at(18), bounds, false))).toBe('17:15:00');
  });
});

describe('wheel items', () => {
  const bounds = getTimeBounds(at(9, 30), at(17, 15));

  it('lists 24 hours and disables hours fully outside the bounds', () => {
    const hours = getHourItems({ is12: false, isPM: false, padHours: true, bounds });
    expect(hours[0]).toMatchObject({ label: '00' });
    expect(disabledValues(hours)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 18, 19, 20, 21, 22, 23]);
  });
  it('lists 12 hours reading 12 for 0, per half of the day', () => {
    const am = getHourItems({ is12: true, isPM: false, padHours: false, bounds });
    expect(am.map((it) => it.label).slice(0, 3)).toEqual(['12', '1', '2']);
    expect(disabledValues(am)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    const pm = getHourItems({ is12: true, isPM: true, padHours: false, bounds });
    expect(disabledValues(pm)).toEqual([6, 7, 8, 9, 10, 11]);
  });
  it('disables minutes outside the bounds for the current hour', () => {
    expect(disabledValues(getMinuteItems(9, 15, bounds))).toEqual([0, 15]);
    expect(disabledValues(getMinuteItems(17, 15, bounds))).toEqual([30, 45]);
    expect(disabledValues(getMinuteItems(12, 15, bounds))).toEqual([]);
  });
  it('lists seconds by interval', () => {
    expect(getSecondItems(20).map((it) => it.label)).toEqual(['00', '20', '40']);
  });
  it('disables a half of the day the bounds exclude', () => {
    expect(disabledValues(getPeriodItems(['AM', 'PM'], getTimeBounds(at(13))))).toEqual([0]);
    expect(disabledValues(getPeriodItems(['AM', 'PM'], getTimeBounds(undefined, at(11))))).toEqual([1]);
  });
});

describe('getTimeColumnSpecs', () => {
  const base = {
    parts: { hours: 14, minutes: 30, seconds: 0 },
    is12: true,
    padHours: false,
    periods: ['AM', 'PM'] as [string, string],
    dayPeriodFirst: false,
    minuteInterval: 1,
    showSeconds: false,
    secondInterval: 1,
    bounds: ALL_DAY,
    loop: true,
  };
  const keys = (patch: Partial<typeof base>) => getTimeColumnSpecs({ ...base, ...patch }).map((c) => c.key);

  it('orders columns by format and options', () => {
    expect(keys({})).toEqual(['hour', 'minute', 'period']);
    expect(keys({ dayPeriodFirst: true })).toEqual(['period', 'hour', 'minute']);
    expect(keys({ is12: false, showSeconds: true })).toEqual(['hour', 'minute', 'second']);
  });
  it('shows 12h values and maps wheel values back to 24h hours', () => {
    const [hour, , period] = getTimeColumnSpecs(base);
    expect(hour?.value).toBe(2);
    expect(hour?.toPatch(5)).toEqual({ hours: 17 });
    expect(period?.value).toBe(1);
    expect(period?.toPatch(0)).toEqual({ hours: 2 });
  });
  it('maps minutes and seconds directly', () => {
    const columns = getTimeColumnSpecs({ ...base, is12: false, showSeconds: true });
    expect(columns[1]?.toPatch(45)).toEqual({ minutes: 45 });
    expect(columns[2]?.toPatch(10)).toEqual({ seconds: 10 });
  });
});

describe('getTimeSeparator', () => {
  it('skips the separator next to AM/PM', () => {
    expect(getTimeSeparator(['hour', 'minute', 'period'], 0, ':')).toBe(':');
    expect(getTimeSeparator(['hour', 'minute', 'period'], 1, ':')).toBeNull();
    expect(getTimeSeparator(['period', 'hour', 'minute'], 0, ':')).toBeNull();
  });
});
