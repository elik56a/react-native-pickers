import { useMemo, useRef, useState } from 'react';
import type { GestureResponderEvent } from 'react-native';
import { PanResponder } from 'react-native';

import { getDayPeriods } from '../../core/utils/date.utils';
import { CLOCK_MODE, DIAL_SIZE, TIME_FORMAT } from '../time.constants';
import type { ClockMode, TimeOptions, TimeParts } from '../time.types';
import {
  buildTime,
  clampTimeOfDay,
  formatTimeValue,
  getDialAngle,
  getDialHand,
  getDialNumbers,
  getTimeBounds,
  getTimeParts,
  is12HourFormat,
  pad2,
  pickDialHour,
  pickDialMinute,
} from '../time.utils';

/** A clock dial's state: hours or minutes, the numbers and hand to draw, and the drag, tap, AM/PM and screen-reader handlers. */
export const useClockDial = (date: Date, onChange: (date: Date) => void, options: TimeOptions) => {
  const { format = TIME_FORMAT.auto, locale, minuteInterval = 1, minTime, maxTime, padHours, dayPeriodLabels } = options;
  const [mode, setMode] = useState<ClockMode>(CLOCK_MODE.hour);
  const is12 = is12HourFormat(format, locale);
  const periods = useMemo(() => dayPeriodLabels ?? getDayPeriods(locale), [dayPeriodLabels, locale]);
  const bounds = getTimeBounds(minTime, maxTime);
  const parts = getTimeParts(date, minuteInterval, 1);
  const isPM = parts.hours >= 12;
  const pad = padHours ?? !is12;

  const set = (patch: Partial<TimeParts>) => onChange(clampTimeOfDay(buildTime(date, parts, patch, false), bounds, false));

  const pickAt = (x: number, y: number) => {
    const dx = x - DIAL_SIZE / 2;
    const dy = y - DIAL_SIZE / 2;
    const angle = getDialAngle(dx, dy);
    const next = buildTime(
      date,
      parts,
      mode === CLOCK_MODE.hour
        ? { hours: pickDialHour(angle, Math.hypot(dx, dy), is12, isPM) }
        : { minutes: pickDialMinute(angle, minuteInterval) },
      false
    );
    if (next.getTime() !== buildTime(date, parts, {}, false).getTime()) onChange(clampTimeOfDay(next, bounds, false));
  };
  // Lifting the finger after choosing the hour moves on to the minutes.
  const finish = () => {
    if (mode === CLOCK_MODE.hour) setMode(CLOCK_MODE.minute);
  };
  // The responder is created once, so it calls the latest handlers, and reads touches against where the dial was on the page.
  const latest = useRef({ pickAt, finish });
  latest.current = { pickAt, finish };
  const origin = useRef({ x: 0, y: 0 });
  const pick = (e: GestureResponderEvent) =>
    latest.current.pickAt(e.nativeEvent.pageX - origin.current.x, e.nativeEvent.pageY - origin.current.y);
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e) => {
        const { pageX, pageY, locationX, locationY } = e.nativeEvent;
        origin.current = { x: pageX - locationX, y: pageY - locationY };
        pick(e);
      },
      onPanResponderMove: pick,
      onPanResponderRelease: () => latest.current.finish(),
    })
  ).current;

  return {
    mode,
    setMode,
    is12,
    isPM,
    periods,
    selected: mode === CLOCK_MODE.hour ? parts.hours : parts.minutes,
    hourLabel: is12 ? String(parts.hours % 12 || 12) : pad ? pad2(parts.hours) : String(parts.hours),
    minuteLabel: pad2(parts.minutes),
    valueText: formatTimeValue(date, { format, locale }),
    numbers: getDialNumbers({ mode, hours: parts.hours, is12, padHours: pad, bounds }),
    hand: getDialHand(mode, parts.hours, parts.minutes, is12),
    panHandlers: pan.panHandlers,
    selectPeriod: (pm: boolean) => {
      if (pm !== isPM) set({ hours: (parts.hours + 12) % 24 });
    },
    step: (direction: 1 | -1) =>
      mode === CLOCK_MODE.hour
        ? set({ hours: (parts.hours + direction + 24) % 24 })
        : set({ minutes: (parts.minutes + direction * minuteInterval + 60) % 60 }),
  };
};
