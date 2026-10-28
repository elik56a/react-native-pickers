import { useMemo, useRef, useState } from 'react';
import type { Animated, GestureResponderEvent, GestureResponderHandlers } from 'react-native';
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
  parseTypedTime,
  pickDialHour,
  pickDialMinute,
} from '../time.utils';
import { useDialHand } from './useDialHand';

/**
 * A clock dial's state: hours or minutes, dial or keyboard, the numbers and hand to draw, and the drag, tap, typing, AM/PM and
 * screen-reader handlers.
 */
export const useClockDial = (date: Date, onChange: (date: Date) => void, options: TimeOptions, duration: number, inputOnly = false) => {
  const { format = TIME_FORMAT.auto, locale, minuteInterval = 1, minTime, maxTime, padHours, dayPeriodLabels } = options;
  const [mode, setMode] = useState<ClockMode>(CLOCK_MODE.hour);
  const [typing, setTyping] = useState(inputOnly);
  const [wasInputOnly, setWasInputOnly] = useState(inputOnly);
  // Switching `display` between 'dial' and 'input' on a mounted picker moves it to the fields or back to the dial.
  if (inputOnly !== wasInputOnly) {
    setWasInputOnly(inputOnly);
    setTyping(inputOnly);
  }
  const [draft, setDraft] = useState<{ mode: ClockMode; text: string } | null>(null);
  const dragging = useRef(false);
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
    dragging.current = false;
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
        dragging.current = false;
        pick(e);
      },
      onPanResponderMove: (e) => {
        dragging.current = true;
        pick(e);
      },
      onPanResponderRelease: () => latest.current.finish(),
    })
  ).current;
  const hand = getDialHand(mode, parts.hours, parts.minutes, is12);
  // Public react-native types, so the emitted .d.ts doesn't reach into its internal files.
  const rotation: Animated.AnimatedInterpolation<string> = useDialHand(hand.angle, dragging, duration);
  const panHandlers: GestureResponderHandlers = pan.panHandlers;
  const hourLabel = is12 ? String(parts.hours % 12 || 12) : pad ? pad2(parts.hours) : String(parts.hours);
  const minuteLabel = pad2(parts.minutes);

  return {
    mode,
    setMode,
    is12,
    isPM,
    periods,
    selected: mode === CLOCK_MODE.hour ? parts.hours : parts.minutes,
    hourLabel,
    minuteLabel,
    valueText: formatTimeValue(date, { format, locale }),
    numbers: getDialNumbers({ mode, hours: parts.hours, is12, padHours: pad, bounds }),
    handRadius: hand.radius,
    rotation,
    typing,
    toggleTyping: () => {
      setTyping(!typing);
      setDraft(null);
    },
    /** What a typed field shows: the text being typed into it, else the time. */
    fieldText: (field: ClockMode) => (draft?.mode === field ? draft.text : field === CLOCK_MODE.hour ? hourLabel : minuteLabel),
    type: (field: ClockMode, text: string) => {
      setDraft({ mode: field, text });
      const patch = parseTypedTime(field, text, is12, isPM, minuteInterval);
      if (patch) set(patch);
    },
    endTyping: () => setDraft(null),
    panHandlers,
    selectPeriod: (pm: boolean) => {
      if (pm !== isPM) set({ hours: (parts.hours + 12) % 24 });
    },
    step: (direction: 1 | -1) =>
      mode === CLOCK_MODE.hour
        ? set({ hours: (parts.hours + direction + 24) % 24 })
        : set({ minutes: (parts.minutes + direction * minuteInterval + 60) % 60 }),
  };
};
