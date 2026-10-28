import type { DurationColumnSpec } from './duration.types';
import {
  formatDuration,
  getDurationColumnSpecs,
  getDurationParts,
  getMaxDigits,
  parseTypedUnit,
  resolveDurationOptions,
  snapDuration,
} from './duration.utils';

const H = 3600;
type Item = { label: string; value: number; disabled?: boolean };
const itemsOf = (spec?: DurationColumnSpec) => (spec?.items ?? []) as Item[];
const labelsOf = (spec?: DurationColumnSpec) => itemsOf(spec).map((i) => i.label);
const disabledOf = (spec?: DurationColumnSpec) =>
  itemsOf(spec)
    .filter((i) => i.disabled)
    .map((i) => i.value);

describe('getDurationParts', () => {
  it('splits seconds into hours, minutes and seconds, snapped to the intervals', () => {
    const options = resolveDurationOptions({ showSeconds: true, minuteInterval: 5, secondInterval: 15 });
    expect(getDurationParts(H + 37 * 60 + 50, options)).toEqual({ hours: 1, minutes: 35, seconds: 45 });
  });

  it('counts minutes past 59 without an hours wheel, and drops seconds unless shown', () => {
    expect(getDurationParts(90 * 60 + 20, resolveDurationOptions({ showHours: false }))).toEqual({ hours: 0, minutes: 90, seconds: 0 });
  });
});

describe('snapDuration', () => {
  it('returns what the wheels show, within the bounds', () => {
    expect(snapDuration(7 * 60 + 30, { minuteInterval: 5 })).toBe(5 * 60);
    expect(snapDuration(0, { min: 10 * 60 })).toBe(10 * 60);
    expect(snapDuration(3 * H, { max: 2 * H })).toBe(2 * H);
  });
});

describe('getDurationColumnSpecs', () => {
  it('builds hours up to max and minutes in steps, with their units', () => {
    const options = resolveDurationOptions({ max: 2 * H, minuteInterval: 15 });
    const [hours, minutes] = getDurationColumnSpecs({ hours: 2, minutes: 0, seconds: 0 }, options, true);
    expect(labelsOf(hours)).toEqual(['0', '1', '2']);
    expect(hours).toMatchObject({ suffix: 'h', accessibilityLabel: 'Hours', loop: false });
    expect(labelsOf(minutes)).toEqual(['0', '15', '30', '45']);
    expect(minutes).toMatchObject({ suffix: 'min', loop: true });
    expect(disabledOf(minutes)).toEqual([15, 30, 45]);
  });

  it('disables what falls below min', () => {
    const options = resolveDurationOptions({ min: 90, showSeconds: true, showHours: false, max: 5 * 60 });
    const [minutes, seconds] = getDurationColumnSpecs({ hours: 0, minutes: 1, seconds: 30 }, options, true);
    expect(labelsOf(minutes)).toEqual(['0', '1', '2', '3', '4', '5']);
    expect(disabledOf(minutes)).toEqual([0]);
    expect(disabledOf(seconds)).toEqual(Array.from({ length: 30 }, (_, i) => i));
  });
});

describe('formatDuration', () => {
  it('names the units that are not zero', () => {
    expect(formatDuration(H + 30 * 60)).toBe('1 h 30 min');
    expect(formatDuration(2 * H)).toBe('2 h');
    expect(formatDuration(95)).toBe('1 min 35 s');
    expect(formatDuration(90 * 60, { showHours: false })).toBe('90 min');
    expect(formatDuration(0)).toBe('0 min');
    expect(formatDuration(45 * 60, { labels: { minutes: 'Min.' } })).toBe('45 Min.');
  });
});

describe('parseTypedUnit', () => {
  const items = [0, 15, 30, 45].map((m) => ({
    label: String(m),
    value: m,
  }));

  it('takes only a number that is one of the values', () => {
    expect(parseTypedUnit('30', items)).toBe(30);
    expect(parseTypedUnit('3', items)).toBeNull();
    expect(parseTypedUnit('', items)).toBeNull();
    expect(parseTypedUnit('1a', items)).toBeNull();
  });
});

describe('getMaxDigits', () => {
  it('fits the largest value', () => {
    expect(getMaxDigits([0, 5, 59])).toBe(2);
    expect(getMaxDigits([0, 90, 120])).toBe(3);
  });
});
