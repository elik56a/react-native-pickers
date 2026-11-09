import type { ComponentRef } from 'react';
import { useCallback, useMemo, useRef } from 'react';
import type { GestureResponderEvent, LayoutChangeEvent, ScrollView } from 'react-native';

import { useControllableState } from '../../core/hooks/useControllableState';
import { useSlideIn } from '../../core/hooks/useSlideIn';
import { useSwipe } from '../../core/hooks/useSwipe';
import { useComponentTheme } from '../../core/theme/ThemeProvider';
import { addDays, isSameDay, startOfDay, toDateKey } from '../../core/utils/date.utils';
import { TIME_FORMAT } from '../../time/time.constants';
import { is12HourFormat } from '../../time/time.utils';
import { DEFAULT_HOUR_HEIGHT, DEFAULT_SNAP_MINUTES, HOUR_MS, MIN_EVENT_HEIGHT, SCHEDULE_DESIGN } from '../schedule.constants';
import type { ScheduleEvent, TimelineProps } from '../schedule.types';
import {
  getAllDayEvents,
  getDaySegments,
  getInitialScrollHour,
  getNowOffset,
  getSlotAt,
  getTapOffset,
  getTimelineDays,
  layoutSegments,
  resolveHours,
  resolveNumberOfDays,
  resolveScheduleLabels,
} from '../schedule.utils';
import { useEventInfo } from './useEventInfo';
import { useNow } from './useNow';

/** A timeline's days and what's on them, the hours, the current time, and the swipe and taps that change them. */
export const useTimeline = <T extends ScheduleEvent>(props: TimelineProps<T>) => {
  const {
    events,
    date: dateProp,
    defaultDate,
    onDateChange,
    numberOfDays,
    startHour: startHourProp,
    endHour: endHourProp,
    hourHeight = DEFAULT_HOUR_HEIGHT,
    initialScrollHour,
    showNowIndicator = true,
    onSlotPress,
    snapMinutes = DEFAULT_SNAP_MINUTES,
    locale,
    format = TIME_FORMAT.auto,
    labels: labelsProp,
    theme: themeProp,
    design: designProp,
  } = props;
  const { theme } = useComponentTheme(themeProp, designProp);
  const design = SCHEDULE_DESIGN[theme.design];
  const [date, setDate] = useControllableState(dateProp, () => defaultDate ?? new Date(), onDateChange);
  const count = resolveNumberOfDays(numberOfDays);
  const [startHour, endHour] = resolveHours(startHourProp, endHourProp);
  const hour12 = is12HourFormat(format, locale);
  const labels = useMemo(() => resolveScheduleLabels(labelsProp), [labelsProp]);
  const now = useNow(showNowIndicator);

  const dateKey = toDateKey(date);
  // biome-ignore lint/correctness/useExhaustiveDependencies: a new Date for the same day keeps the days.
  const days = useMemo(() => getTimelineDays(date, count), [dateKey, count]);
  const minDurationMs = (MIN_EVENT_HEIGHT / hourHeight) * HOUR_MS;
  const columns = useMemo(
    () =>
      days.map((day) => ({
        day,
        key: toDateKey(day),
        segments: layoutSegments(getDaySegments(events, day, startHour, endHour), minDurationMs),
        allDay: getAllDayEvents(events, day),
      })),
    [days, endHour, events, minDurationMs, startHour]
  );
  const todayIndex = days.findIndex((day) => isSameDay(day, now));
  const nowOffset = showNowIndicator && todayIndex >= 0 ? getNowOffset(now, startHour, endHour, hourHeight) : null;

  const slide = useSlideIn(theme.animation.duration);
  const go = useCallback(
    (delta: number) => {
      setDate(addDays(startOfDay(date), delta * count));
      slide.from(delta);
    },
    [count, date, setDate, slide]
  );
  const panHandlers = useSwipe(go);

  // Opens scrolled to the hour worked out on the first render, once the scroll view and its content both have a size.
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const initialY = useRef(
    ((initialScrollHour ?? getInitialScrollHour({ days, events, now, startHour, endHour })) - startHour) * hourHeight
  );
  const sizes = useRef({ view: 0, content: 0, scrolled: false });
  const scrollOnce = useCallback(() => {
    const s = sizes.current;
    if (s.scrolled || !s.view || !s.content) return;
    s.scrolled = true;
    scrollRef.current?.scrollTo({ y: initialY.current, animated: false });
  }, []);
  const onScrollLayout = useCallback(
    (e: LayoutChangeEvent) => {
      sizes.current.view = e.nativeEvent.layout.height;
      scrollOnce();
    },
    [scrollOnce]
  );
  const onContentSizeChange = useCallback(
    (_: number, height: number) => {
      sizes.current.content = height;
      scrollOnce();
    },
    [scrollOnce]
  );

  const pressSlot = useCallback(
    (day: Date, e: GestureResponderEvent) => {
      const y = getTapOffset(e.nativeEvent);
      if (y !== null) onSlotPress?.(getSlotAt(day, y, { startHour, endHour, hourHeight, snapMinutes }));
    },
    [endHour, hourHeight, onSlotPress, snapMinutes, startHour]
  );

  const infoFor = useEventInfo<T>({ locale, hour12, labels, fill: design.eventFill, theme });

  return {
    theme,
    design,
    labels,
    hour12,
    startHour,
    endHour,
    hourHeight,
    columns,
    hasAllDay: columns.some((column) => column.allDay.length > 0),
    now,
    todayIndex,
    nowOffset,
    slideStyle: slide.style,
    panHandlers,
    scrollRef,
    onScrollLayout,
    onContentSizeChange,
    pressSlot: onSlotPress ? pressSlot : undefined,
    infoFor,
  };
};
