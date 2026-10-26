import type React from 'react';

import { formatDate, uses12HourClock } from '../core/utils/date.utils';
import type { WheelItem } from '../wheel/wheel.types';
import { LAST_SECOND_OF_DAY, NOON_SECONDS, SECONDS_PER_HOUR, SECONDS_PER_MINUTE, TIME_COLUMN, TIME_FORMAT } from './time.constants';
import type { TimeBounds, TimeColumnKey, TimeColumnSpec, TimeFormat, TimeOptions, TimeParts } from './time.types';

export const pad2 = (n: number) => String(n).padStart(2, '0');

/** 0, step, 2·step… below `count`. */
export const steps = (count: number, step = 1) => Array.from({ length: Math.ceil(count / step) }, (_, i) => i * step);

export const secondsOfDay = (d: Date) => d.getHours() * SECONDS_PER_HOUR + d.getMinutes() * SECONDS_PER_MINUTE + d.getSeconds();

export const is12HourFormat = (format: TimeFormat, locale?: string) =>
  format === TIME_FORMAT.auto ? uses12HourClock(locale) : format === TIME_FORMAT.twelveHour;

export const getTimeBounds = (minTime?: Date, maxTime?: Date): TimeBounds => [
  minTime ? secondsOfDay(minTime) : 0,
  maxTime ? secondsOfDay(maxTime) : LAST_SECOND_OF_DAY,
];

/** The time shown on the wheels: minutes and seconds snap down to their intervals. */
export const getTimeParts = (date: Date, minuteInterval: number, secondInterval: number): TimeParts => ({
  hours: date.getHours(),
  minutes: Math.floor(date.getMinutes() / minuteInterval) * minuteInterval,
  seconds: Math.floor(date.getSeconds() / secondInterval) * secondInterval,
});

/** `date` with its time set from `parts` plus `patch`; seconds are zeroed unless shown. */
export const buildTime = (date: Date, parts: TimeParts, patch: Partial<TimeParts>, showSeconds: boolean) => {
  const next = new Date(date);
  next.setHours(patch.hours ?? parts.hours, patch.minutes ?? parts.minutes, showSeconds ? (patch.seconds ?? parts.seconds) : 0, 0);
  return next;
};

/** `date` exactly as the wheels show it, so confirming without scrolling returns what the user saw. */
export const snapTime = (
  date: Date,
  { minuteInterval = 1, secondInterval = 1, showSeconds = false }: Pick<TimeOptions, 'minuteInterval' | 'secondInterval' | 'showSeconds'>
) => buildTime(date, getTimeParts(date, minuteInterval, secondInterval), {}, showSeconds);

/** Pulls a time outside the bounds back to the nearest bound. */
export const clampTimeOfDay = (date: Date, [minSecond, maxSecond]: TimeBounds, showSeconds: boolean) => {
  const second = secondsOfDay(date);
  if (second >= minSecond && second <= maxSecond) return date;
  const target = second < minSecond ? minSecond : maxSecond;
  const next = new Date(date);
  next.setHours(
    Math.floor(target / SECONDS_PER_HOUR),
    Math.floor((target % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE),
    showSeconds ? target % SECONDS_PER_MINUTE : 0,
    0
  );
  return next;
};

/** An hour (or minute) is selectable when any second of it is within bounds. */
const spanOutOfBounds = (start: number, length: number, [minSecond, maxSecond]: TimeBounds) =>
  start + length - 1 < minSecond || start > maxSecond;

/** In 12h mode the wheel values are 0–11 and 0 reads as 12. */
export const getHourItems = (params: { is12: boolean; isPM: boolean; padHours: boolean; bounds: TimeBounds }): WheelItem<number>[] => {
  const { is12, isPM, padHours, bounds } = params;
  const label = (hour: number) => (padHours ? pad2(hour) : String(hour));
  if (!is12) {
    return steps(24).map((hour) => ({
      value: hour,
      label: label(hour),
      disabled: spanOutOfBounds(hour * SECONDS_PER_HOUR, SECONDS_PER_HOUR, bounds),
    }));
  }
  return steps(12).map((hour) => ({
    value: hour,
    label: label(hour === 0 ? 12 : hour),
    disabled: spanOutOfBounds(((isPM ? 12 : 0) + hour) * SECONDS_PER_HOUR, SECONDS_PER_HOUR, bounds),
  }));
};

export const getMinuteItems = (hours: number, minuteInterval: number, bounds: TimeBounds): WheelItem<number>[] =>
  steps(60, minuteInterval).map((minute) => ({
    value: minute,
    label: pad2(minute),
    disabled: spanOutOfBounds(hours * SECONDS_PER_HOUR + minute * SECONDS_PER_MINUTE, SECONDS_PER_MINUTE, bounds),
  }));

export const getSecondItems = (secondInterval: number): WheelItem<number>[] =>
  steps(60, secondInterval).map((second) => ({
    value: second,
    label: pad2(second),
  }));

export const getPeriodItems = ([am, pm]: [string, string], [minSecond, maxSecond]: TimeBounds): WheelItem<number>[] => [
  {
    value: 0,
    label: am,
    disabled: minSecond >= NOON_SECONDS,
  },
  {
    value: 1,
    label: pm,
    disabled: maxSecond < NOON_SECONDS,
  },
];

export const getTimeColumnSpecs = (params: {
  parts: TimeParts;
  is12: boolean;
  padHours: boolean;
  periods: [string, string];
  dayPeriodFirst: boolean;
  minuteInterval: number;
  showSeconds: boolean;
  secondInterval: number;
  bounds: TimeBounds;
  loop: boolean;
}): TimeColumnSpec[] => {
  const { parts, is12, padHours, periods, dayPeriodFirst, minuteInterval, showSeconds, secondInterval, bounds, loop } = params;
  const isPM = parts.hours >= 12;

  const period: TimeColumnSpec = {
    key: TIME_COLUMN.period,
    items: getPeriodItems(periods, bounds),
    value: isPM ? 1 : 0,
    flex: 1,
    toPatch: (pm) => ({ hours: (parts.hours % 12) + (pm ? 12 : 0) }),
  };
  const hour: TimeColumnSpec = {
    key: TIME_COLUMN.hour,
    items: getHourItems({ is12, isPM, padHours, bounds }),
    value: is12 ? parts.hours % 12 : parts.hours,
    loop,
    flex: 1,
    toPatch: (h) => ({ hours: is12 ? (isPM ? 12 : 0) + h : h }),
  };
  const minute: TimeColumnSpec = {
    key: TIME_COLUMN.minute,
    items: getMinuteItems(parts.hours, minuteInterval, bounds),
    value: parts.minutes,
    loop,
    flex: 1,
    toPatch: (m) => ({ minutes: m }),
  };
  const second: TimeColumnSpec = {
    key: TIME_COLUMN.second,
    items: getSecondItems(secondInterval),
    value: parts.seconds,
    loop,
    flex: 1,
    toPatch: (s) => ({ seconds: s }),
  };

  return [is12 && dayPeriodFirst && period, hour, minute, showSeconds && second, is12 && !dayPeriodFirst && period].filter(
    (column): column is TimeColumnSpec => !!column
  );
};

/** No separator next to the AM/PM column. */
export const getTimeSeparator = (columnKeys: TimeColumnKey[], leftIndex: number, separator: React.ReactNode) =>
  columnKeys[leftIndex] === TIME_COLUMN.period || columnKeys[leftIndex + 1] === TIME_COLUMN.period ? null : separator;

export const formatTimeValue = (
  date: Date,
  { format = TIME_FORMAT.auto, locale, showSeconds = false }: Pick<TimeOptions, 'format' | 'locale' | 'showSeconds'>
) =>
  formatDate(date, locale, {
    hour: 'numeric',
    minute: '2-digit',
    second: showSeconds ? '2-digit' : undefined,
    hour12: is12HourFormat(format, locale),
  });
