import {
  atSecondOfDay,
  buildTime,
  clampTimeOfDay,
  formatTimeValue,
  getDialAngle,
  getDialHand,
  getDialNumbers,
  getHourItems,
  getMinuteItems,
  getPeriodItems,
  getSecondItems,
  getTimeBounds,
  getTimeColumnSpecs,
  getTimeListItems,
  getTimeListScrollIndex,
  getTimeParts,
  getTimeSeparator,
  is12HourFormat,
  pad2,
  pickDialHour,
  pickDialMinute,
  resolveTimeDisplay,
  secondsOfDay,
  snapTime,
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

describe('snapTime', () => {
  it('snaps to the intervals and drops hidden seconds', () => {
    expect(hhmmss(snapTime(at(10, 7, 42), { minuteInterval: 5 }))).toBe('10:05:00');
  });
  it('keeps snapped seconds when they are shown', () => {
    expect(hhmmss(snapTime(at(10, 7, 42), { minuteInterval: 5, showSeconds: true, secondInterval: 15 }))).toBe('10:05:30');
  });
  it('keeps the date', () => {
    expect(snapTime(at(10, 7), {}).getDate()).toBe(25);
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

describe('formatTimeValue', () => {
  const time = new Date(2026, 9, 26, 21, 5, 7);

  it('follows the format, or the locale on auto', () => {
    expect(formatTimeValue(time, { format: '24h', locale: 'en-US' })).toBe('21:05');
    expect(formatTimeValue(time, { format: '12h', locale: 'en-GB' })).toMatch(/^9:05\spm$/i);
    expect(formatTimeValue(time, { locale: 'en-US' })).toMatch(/^9:05\sPM$/);
  });

  it('adds seconds when shown', () => {
    expect(formatTimeValue(time, { format: '24h', locale: 'en-US', showSeconds: true })).toBe('21:05:07');
  });
});

describe('time lists', () => {
  const day = new Date(2026, 9, 27, 13, 7, 30);

  it('sets a time of day and keeps the day', () => {
    const at = atSecondOfDay(day, 9 * 3600 + 15 * 60);
    expect([at.getDate(), at.getHours(), at.getMinutes(), at.getSeconds()]).toEqual([27, 9, 15, 0]);
  });

  it('offers every step within the bounds, labelled for the locale', () => {
    const items = getTimeListItems(day, 30, [9 * 3600, 10 * 3600], { format: '24h', locale: 'en-GB' });
    expect(items).toEqual([
      { value: 32400, label: '9:00' },
      { value: 34200, label: '9:30' },
      { value: 36000, label: '10:00' },
    ]);
    expect(getTimeListItems(day, 15, [0, 86399], { format: 'auto' })).toHaveLength(96);
  });

  it('opens a little above the chosen time, or the next one, without scrolling past either end', () => {
    const items = getTimeListItems(day, 60, [0, 86399], { format: '24h' });
    expect(getTimeListScrollIndex(items, 12 * 3600, 6)).toBe(9);
    expect(getTimeListScrollIndex(items, 12 * 3600 + 60, 6)).toBe(10);
    expect(getTimeListScrollIndex(items, 3600, 6)).toBe(0);
    expect(getTimeListScrollIndex(items, 23 * 3600, 6)).toBe(18);
    expect(getTimeListScrollIndex([], 0, 6)).toBe(0);
  });
});

describe('time display', () => {
  it('follows the design unless asked, and turns a dial into wheels when seconds show', () => {
    expect(resolveTimeDisplay(undefined, 'ios', false)).toBe('wheel');
    expect(resolveTimeDisplay(undefined, 'material', false)).toBe('dial');
    expect(resolveTimeDisplay(undefined, 'web', false)).toBe('list');
    expect(resolveTimeDisplay('list', 'material', false)).toBe('list');
    expect(resolveTimeDisplay(undefined, 'material', true)).toBe('wheel');
  });
});

describe('clock dial', () => {
  it("measures angles clockwise from 12 o'clock", () => {
    expect(getDialAngle(0, -10)).toBe(0);
    expect(getDialAngle(10, 0)).toBe(90);
    expect(getDialAngle(0, 10)).toBe(180);
    expect(getDialAngle(-10, 0)).toBe(270);
  });

  it('picks 12h hours in the current half of the day', () => {
    expect(pickDialHour(90, 100, true, false)).toBe(3);
    expect(pickDialHour(90, 100, true, true)).toBe(15);
    expect(pickDialHour(0, 100, true, false)).toBe(0);
    expect(pickDialHour(0, 100, true, true)).toBe(12);
    expect(pickDialHour(352, 100, true, false)).toBe(0);
  });

  it('picks 24h hours from the outer ring (12, 1–11) or the inner one (00, 13–23)', () => {
    expect(pickDialHour(90, 100, false, false)).toBe(3);
    expect(pickDialHour(90, 60, false, false)).toBe(15);
    expect(pickDialHour(0, 100, false, false)).toBe(12);
    expect(pickDialHour(0, 60, false, false)).toBe(0);
  });

  it('snaps minutes to the interval, wrapping at the hour', () => {
    expect(pickDialMinute(45, 1)).toBe(8);
    expect(pickDialMinute(45, 5)).toBe(10);
    expect(pickDialMinute(357, 5)).toBe(0);
  });

  it('points the hand at the hour or minute, to the inner ring for 24h 00 and 13–23', () => {
    expect(getDialHand('hour', 15, 0, true)).toEqual({ angle: 90, radius: 104 });
    expect(getDialHand('hour', 15, 0, false)).toEqual({ angle: 90, radius: 66 });
    expect(getDialHand('minute', 15, 20, false)).toEqual({ angle: 120, radius: 104 });
  });

  it('lays out 12 numbers on a 12h dial, 24 on a 24h one, dimming those out of bounds', () => {
    const all: [number, number] = [0, 86399];
    const twelve = getDialNumbers({ mode: 'hour', hours: 14, is12: true, padHours: false, bounds: all });
    expect(twelve.map((n) => n.label)).toEqual(['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']);
    expect(twelve[3]).toMatchObject({ value: 15, x: 232, y: 128 });
    const day = getDialNumbers({ mode: 'hour', hours: 9, is12: false, padHours: true, bounds: [9 * 3600, 17 * 3600] });
    expect(day).toHaveLength(24);
    expect(day.find((n) => n.value === 0)).toMatchObject({ label: '00', inner: true, disabled: true });
    expect(day.find((n) => n.value === 9)?.disabled).toBe(false);
    const minutes = getDialNumbers({ mode: 'minute', hours: 9, is12: false, padHours: true, bounds: [9 * 3600 + 30 * 60, 86399] });
    expect(minutes.map((n) => n.label).slice(0, 3)).toEqual(['00', '05', '10']);
    expect(minutes.find((n) => n.value === 25)?.disabled).toBe(true);
    expect(minutes.find((n) => n.value === 30)?.disabled).toBe(false);
  });
});
