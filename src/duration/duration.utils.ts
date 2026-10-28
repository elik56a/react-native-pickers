import { SECONDS_PER_HOUR, SECONDS_PER_MINUTE } from '../time/time.constants';
import type { TimeBounds } from '../time/time.types';
import { spanOutOfBounds, steps } from '../time/time.utils';
import type { WheelItem, WheelItemInput } from '../wheel/wheel.types';
import { normalizeItem } from '../wheel/wheel.utils';
import { DEFAULT_DURATION_LABELS, DURATION_COLUMN_LABEL, DURATION_UNIT, DURATION_UNITS } from './duration.constants';
import type { DurationColumnSpec, DurationOptions, DurationParts, ResolvedDurationOptions } from './duration.types';

/** Up to 23 h 59 min 59 s, like iOS's countdown timer, or 59 min 59 s without an hours wheel. */
export const getDefaultMaxDuration = (showHours: boolean) => (showHours ? 24 * SECONDS_PER_HOUR : SECONDS_PER_HOUR) - 1;

export const resolveDurationOptions = ({
  showHours = true,
  showSeconds = false,
  minuteInterval = 1,
  secondInterval = 1,
  min = 0,
  max,
  labels,
}: DurationOptions): ResolvedDurationOptions => ({
  showHours,
  showSeconds,
  minuteInterval,
  secondInterval,
  bounds: [min, max ?? getDefaultMaxDuration(showHours)],
  labels: {
    hours: labels?.hours ?? DEFAULT_DURATION_LABELS.hours,
    minutes: labels?.minutes ?? DEFAULT_DURATION_LABELS.minutes,
    seconds: labels?.seconds ?? DEFAULT_DURATION_LABELS.seconds,
  },
});

/** The duration as the wheels show it: minutes and seconds snap down to their intervals, and without hours minutes count past 59. */
export const getDurationParts = (
  total: number,
  { showHours, showSeconds, minuteInterval, secondInterval }: ResolvedDurationOptions
): DurationParts => {
  const hours = showHours ? Math.floor(total / SECONDS_PER_HOUR) : 0;
  const minutes = Math.floor((total - hours * SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
  return {
    hours,
    minutes: Math.floor(minutes / minuteInterval) * minuteInterval,
    seconds: showSeconds ? Math.floor((total % SECONDS_PER_MINUTE) / secondInterval) * secondInterval : 0,
  };
};

export const toSeconds = ({ hours, minutes, seconds }: DurationParts) => hours * SECONDS_PER_HOUR + minutes * SECONDS_PER_MINUTE + seconds;

export const clampDuration = (seconds: number, [min, max]: TimeBounds) => Math.min(Math.max(seconds, min), max);

/** `total` exactly as the wheels show it, within the bounds, so confirming without scrolling returns what the user saw. */
export const snapDuration = (total: number, options: DurationOptions) => {
  const resolved = resolveDurationOptions(options);
  return clampDuration(toSeconds(getDurationParts(total, resolved)), resolved.bounds);
};

const toItems = (values: number[], start: (v: number) => number, length: number, bounds: TimeBounds): WheelItem<number>[] =>
  values.map((v) => ({
    value: v,
    label: String(v),
    disabled: spanOutOfBounds(start(v), length, bounds),
  }));

/** The hours, minutes and seconds wheels; a value is disabled when no duration it leads to is within the bounds. */
export const getDurationColumnSpecs = (parts: DurationParts, options: ResolvedDurationOptions, loop: boolean): DurationColumnSpec[] => {
  const { showHours, showSeconds, minuteInterval, secondInterval, bounds, labels } = options;
  const [, max] = bounds;
  const base = parts.hours * SECONDS_PER_HOUR;
  const minuteCount = showHours ? 60 : Math.floor(max / SECONDS_PER_MINUTE) + 1;
  const column = (key: DurationColumnSpec['key'], items: WheelItem<number>[], wraps: boolean): DurationColumnSpec => ({
    key,
    items,
    value: parts[key],
    loop: wraps,
    flex: 1,
    textAlign: 'right',
    suffix: labels[key],
    accessibilityLabel: DURATION_COLUMN_LABEL[key],
    toPatch: (v) => ({ [key]: v }),
  });

  const hours = column(
    DURATION_UNIT.hours,
    toItems(steps(Math.floor(max / SECONDS_PER_HOUR) + 1), (h) => h * SECONDS_PER_HOUR, SECONDS_PER_HOUR, bounds),
    false
  );
  const minutes = column(
    DURATION_UNIT.minutes,
    toItems(steps(minuteCount, minuteInterval), (m) => base + m * SECONDS_PER_MINUTE, SECONDS_PER_MINUTE, bounds),
    loop
  );
  const seconds = column(
    DURATION_UNIT.seconds,
    toItems(steps(60, secondInterval), (s) => base + parts.minutes * SECONDS_PER_MINUTE + s, 1, bounds),
    loop
  );

  return [showHours && hours, minutes, showSeconds && seconds].filter((c): c is DurationColumnSpec => !!c);
};

/** "1 h 30 min": the units that aren't zero, or "0 min". Exact to the second; without hours, minutes count past 59. */
export const formatDuration = (total: number, { showHours, labels }: Pick<DurationOptions, 'showHours' | 'labels'> = {}) => {
  const resolved = resolveDurationOptions({ showHours, labels, showSeconds: true });
  const parts = getDurationParts(total, resolved);
  const shown = DURATION_UNITS.filter((unit) => parts[unit] > 0).map((unit) => `${parts[unit]} ${resolved.labels[unit]}`);
  return shown.length ? shown.join(' ') : `0 ${resolved.labels.minutes}`;
};

/** The value typed into a duration box, or null while it isn't one of the column's values yet (with a 15-minute step, "3" on the way to "30"). */
export const parseTypedUnit = (text: string, items: ReadonlyArray<WheelItemInput<number>>) => {
  if (!/^\d+$/.test(text)) return null;
  const n = Number(text);
  return items.some((item) => normalizeItem(item).value === n) ? n : null;
};

/** How many digits a duration box takes: as many as its largest value. */
export const getMaxDigits = (items: ReadonlyArray<WheelItemInput<number>>) =>
  String(Math.max(0, ...items.map((item) => normalizeItem(item).value))).length;
