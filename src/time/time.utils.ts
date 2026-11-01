import type React from 'react';

import type { Design } from '../core/theme/theme.types';
import { formatDate, uses12HourClock } from '../core/utils/date.utils';
import type { WheelItem } from '../wheel/wheel.types';
import {
  CLOCK_MODE,
  DEFAULT_RANGE_MINUTES,
  DEGREES_PER_HOUR,
  DEGREES_PER_MINUTE,
  DIAL_INNER_RADIUS,
  DIAL_MINUTE_LABEL_STEP,
  DIAL_OUTER_RADIUS,
  DIAL_SIZE,
  LAST_SECOND_OF_DAY,
  NEXT_DAY_MARK,
  NOON_SECONDS,
  SECONDS_PER_DAY,
  SECONDS_PER_HOUR,
  SECONDS_PER_MINUTE,
  TIME_COLUMN,
  TIME_COLUMN_LABEL,
  TIME_DISPLAY,
  TIME_DISPLAY_DESIGN,
  TIME_FORMAT,
  TIME_RANGE_END,
  TIME_RANGE_SEPARATOR,
} from './time.constants';
import type {
  ClockMode,
  DialNumber,
  TimeBounds,
  TimeColumnKey,
  TimeColumnSpec,
  TimeDisplay,
  TimeFormat,
  TimeOptions,
  TimePanelColumn,
  TimeParts,
  TimeRange,
  TimeRangeEnd,
  TimeRangeRules,
} from './time.types';

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
export const spanOutOfBounds = (start: number, length: number, [minSecond, maxSecond]: TimeBounds) =>
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

/** The display to draw: the one asked for, else the design's; a dial or time input has no seconds, so it falls back to wheels. */
export const resolveTimeDisplay = (display: TimeDisplay | undefined, design: Design, showSeconds: boolean): TimeDisplay => {
  const chosen = display ?? TIME_DISPLAY_DESIGN[design];
  const clock = chosen === TIME_DISPLAY.dial || chosen === TIME_DISPLAY.input;
  return clock && showSeconds ? TIME_DISPLAY.wheel : chosen;
};

/** Degrees clockwise from 12 o'clock to a point `dx`, `dy` from the dial's centre (y grows downward). */
export const getDialAngle = (dx: number, dy: number) => ((Math.atan2(dx, -dy) * 180) / Math.PI + 360) % 360;

/** Where a number at `angle` sits, `radius` from the centre of a dial `size` wide. */
export const getDialPoint = (angle: number, radius: number, size: number) => {
  const rad = (angle * Math.PI) / 180;
  return {
    x: size / 2 + radius * Math.sin(rad),
    y: size / 2 - radius * Math.cos(rad),
  };
};

/**
 * The hour under a touch. 12h dials show 12, 1–11 and keep the current half of the day; 24h dials, like Android's, show
 * 12, 1–11 outside and 00, 13–23 on an inner ring.
 */
export const pickDialHour = (angle: number, distance: number, is12: boolean, isPM: boolean) => {
  const slot = Math.round(angle / DEGREES_PER_HOUR) % 12;
  if (is12) return slot + (isPM ? 12 : 0);
  const inner = distance < (DIAL_OUTER_RADIUS + DIAL_INNER_RADIUS) / 2;
  if (inner) return slot === 0 ? 0 : slot + 12;
  return slot === 0 ? 12 : slot;
};

/** The minute under a touch, snapped to the interval. */
export const pickDialMinute = (angle: number, interval: number) => {
  const minute = Math.round(angle / DEGREES_PER_MINUTE) % 60;
  return (Math.round(minute / interval) * interval) % 60;
};

/** Where the hand points, and how long it is: to the inner ring for 24h hours 00 and 13–23, else to the outer one. */
export const getDialHand = (mode: ClockMode, hours: number, minutes: number, is12: boolean) => {
  const inner = mode === CLOCK_MODE.hour && !is12 && (hours === 0 || hours > 12);
  return {
    angle: mode === CLOCK_MODE.hour ? (hours % 12) * DEGREES_PER_HOUR : minutes * DEGREES_PER_MINUTE,
    radius: inner ? DIAL_INNER_RADIUS : DIAL_OUTER_RADIUS,
  };
};

/** The numbers around a dial, dimmed when no time they lead to is within the bounds. */
export const getDialNumbers = (params: {
  mode: ClockMode;
  hours: number;
  is12: boolean;
  padHours: boolean;
  bounds: TimeBounds;
}): DialNumber[] => {
  const { mode, hours, is12, padHours, bounds } = params;
  const hourLabel = (h: number) => (padHours ? pad2(h) : String(h));
  if (mode === CLOCK_MODE.minute) {
    return steps(60, DIAL_MINUTE_LABEL_STEP).map((minute) => ({
      value: minute,
      label: pad2(minute),
      ...getDialPoint(minute * DEGREES_PER_MINUTE, DIAL_OUTER_RADIUS, DIAL_SIZE),
      inner: false,
      disabled: spanOutOfBounds(hours * SECONDS_PER_HOUR + minute * SECONDS_PER_MINUTE, SECONDS_PER_MINUTE, bounds),
    }));
  }
  const pm = hours >= 12 ? 12 : 0;
  const ring = (slot: number, inner: boolean) => {
    const hour = is12 ? (slot % 12) + pm : inner ? (slot === 0 ? 0 : slot + 12) : slot === 0 ? 12 : slot;
    return {
      value: hour,
      label: is12 ? String(slot === 0 ? 12 : slot) : hourLabel(hour),
      ...getDialPoint(slot * DEGREES_PER_HOUR, inner ? DIAL_INNER_RADIUS : DIAL_OUTER_RADIUS, DIAL_SIZE),
      inner,
      disabled: spanOutOfBounds(hour * SECONDS_PER_HOUR, SECONDS_PER_HOUR, bounds),
    };
  };
  const outer = steps(12).map((slot) => ring(slot, false));
  return is12 ? outer : [...outer, ...steps(12).map((slot) => ring(slot, true))];
};

/** `to`, moved by whole turns to be as close as it can to `from`, so a hand turns the short way round (350° → 10° is +20°). */
export const getNearestAngle = (from: number, to: number) => from + ((((to - from) % 360) + 540) % 360) - 180;

/**
 * The time a typed hour or minute sets, or null while it isn't one yet. 12h hours are 1–12 in the current half of the day;
 * minutes snap down to the interval, as the dial shows them.
 */
export const parseTypedTime = (
  mode: ClockMode,
  text: string,
  is12: boolean,
  isPM: boolean,
  minuteInterval: number
): Partial<TimeParts> | null => {
  if (!/^\d{1,2}$/.test(text)) return null;
  const n = Number(text);
  if (mode === CLOCK_MODE.minute) return n < 60 ? { minutes: Math.floor(n / minuteInterval) * minuteInterval } : null;
  if (is12) return n >= 1 && n <= 12 ? { hours: (n % 12) + (isPM ? 12 : 0) } : null;
  return n < 24 ? { hours: n } : null;
};

/** The first row a time panel column shows: the chosen cell in the middle, but never scrolled past either end. */
export const getPanelTopRow = (index: number, count: number, rows: number) =>
  Math.max(0, Math.min(index - Math.floor(rows / 2), count - rows));

/** A time panel cell's screen-reader label: its column and value, like "Hour 09". */
export const getPanelCellLabel = ({ key, accessibilityLabel }: Pick<TimePanelColumn, 'key' | 'accessibilityLabel'>, label: string) => {
  const name = accessibilityLabel ?? TIME_COLUMN_LABEL[key];
  return name ? `${name} ${label}` : label;
};

/** Seconds from the start to the end, into the next day when the end's time of day comes first. */
export const getTimeRangeSeconds = ({ start, end }: TimeRange) => {
  const seconds = secondsOfDay(end) - secondsOfDay(start);
  return seconds < 0 ? seconds + SECONDS_PER_DAY : seconds;
};

export const isOvernight = ({ start, end }: TimeRange) => secondsOfDay(end) < secondsOfDay(start);

/** `seconds` after `start`, counted in local time so a daylight-saving change doesn't shift it. */
const addSeconds = (start: Date, seconds: number) =>
  new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours(), start.getMinutes(), start.getSeconds() + seconds);

/** The length within minDuration–maxDuration, and short of midnight unless the range may run overnight. */
const clampLength = (start: Date, seconds: number, rules: TimeRangeRules) => {
  const untilMidnight = rules.allowOvernight === false ? LAST_SECOND_OF_DAY - secondsOfDay(start) : Number.POSITIVE_INFINITY;
  const longest = Math.min((rules.maxDuration ?? Number.POSITIVE_INFINITY) * SECONDS_PER_MINUTE, untilMidnight);
  return Math.min(Math.max(seconds, (rules.minDuration ?? 0) * SECONDS_PER_MINUTE), longest);
};

/**
 * The range after the user moves one end to `time`. Moving the start carries the end along, keeping the length, as calendar apps do;
 * moving the end keeps the length within the rules. The end lands on the start's day, or the next day.
 */
export const fitTimeRange = (range: TimeRange, moved: TimeRangeEnd, time: Date, rules: TimeRangeRules): TimeRange => {
  if (moved === TIME_RANGE_END.start) {
    return {
      start: time,
      end: addSeconds(time, clampLength(time, getTimeRangeSeconds(range), rules)),
    };
  }
  const seconds = secondsOfDay(time) - secondsOfDay(range.start);
  const length = seconds < 0 && rules.allowOvernight !== false ? seconds + SECONDS_PER_DAY : seconds;
  return {
    start: range.start,
    end: addSeconds(range.start, clampLength(range.start, length, rules)),
  };
};

/** From `now`, for an hour or the shortest range allowed. */
export const getDefaultTimeRange = (now: Date, rules: TimeRangeRules): TimeRange => ({
  start: now,
  end: addSeconds(now, clampLength(now, DEFAULT_RANGE_MINUTES * SECONDS_PER_MINUTE, rules)),
});

type TimeFormatOptions = Pick<TimeOptions, 'format' | 'locale' | 'showSeconds'>;

/** "9:00 AM – 5:00 PM", with " +1" after an end on the next day. */
export const formatTimeRange = (range: TimeRange, options: TimeFormatOptions = {}) =>
  `${formatTimeValue(range.start, options)}${TIME_RANGE_SEPARATOR}${formatTimeValue(range.end, options)}${isOvernight(range) ? NEXT_DAY_MARK : ''}`;

/** The Start and End ends: each one's label and time, with " +1" after an end on the next day. */
export const getTimeRangeEndItems = (range: TimeRange, labels: { start: string; end: string }, options: TimeFormatOptions) =>
  [
    {
      end: TIME_RANGE_END.start,
      label: labels.start,
      time: formatTimeValue(range.start, options),
    },
    {
      end: TIME_RANGE_END.end,
      label: labels.end,
      time: `${formatTimeValue(range.end, options)}${isOvernight(range) ? NEXT_DAY_MARK : ''}`,
    },
  ] as const;
