import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Animated, GestureResponderHandlers } from 'react-native';
import { I18nManager, PanResponder } from 'react-native';

import { useAnimatedValue } from '../../core/hooks/useAnimatedValue';
import { timing } from '../../core/utils/animation.utils';
import { addMonths, isSameMonth, startOfMonth, toDateKey } from '../../core/utils/date.utils';
import { NEXT_VIEW, SLIDE_DISTANCE } from '../calendar.constants';
import type { ArrowDirection, CalendarView } from '../calendar.types';
import { canGoToMonth, getSwipeDelta, isHorizontalSwipe, shiftMonthForView } from '../calendar.utils';

interface UseMonthNavigationParams {
  anchor: Date;
  /** The single-mode selection: when it changes from outside, the calendar shows its month. */
  followDate: Date | null;
  minDate?: Date;
  maxDate?: Date;
  onMonthChange?: (month: Date) => void;
  animationDuration: number;
}

/** Visible month, day/month/year view, slide animation between months and swipe to change month. */
export const useMonthNavigation = ({
  anchor,
  followDate,
  minDate,
  maxDate,
  onMonthChange,
  animationDuration,
}: UseMonthNavigationParams) => {
  const rtl = !!I18nManager.isRTL;
  const [month, setMonth] = useState(anchor);
  const [view, setView] = useState<CalendarView>('days');
  const slide: Animated.Value = useAnimatedValue(0);

  const canPrev = canGoToMonth(month, -1, minDate, maxDate);
  const canNext = canGoToMonth(month, 1, minDate, maxDate);

  const followKey = followDate ? toDateKey(followDate) : '';
  // biome-ignore lint/correctness/useExhaustiveDependencies: only a new date from outside should move the calendar, not paging.
  useEffect(() => {
    if (followDate && view === 'days' && !isSameMonth(followDate, month)) setMonth(startOfMonth(followDate));
  }, [followKey]);

  const goMonth = useCallback(
    (delta: number) => {
      if ((delta < 0 && !canPrev) || (delta > 0 && !canNext)) return;
      const next = addMonths(month, delta);
      setMonth(next);
      onMonthChange?.(next);
      slide.setValue(delta * (rtl ? -1 : 1));
      timing(slide, 0, { duration: animationDuration }).start();
    },
    [animationDuration, canNext, canPrev, month, onMonthChange, rtl, slide]
  );

  // The responder is created once, so it reads the latest goMonth through a ref.
  const goMonthRef = useRef(goMonth);
  goMonthRef.current = goMonth;
  const panHandlers: GestureResponderHandlers = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => isHorizontalSwipe(g.dx, g.dy),
      onPanResponderRelease: (_, g) => {
        const delta = getSwipeDelta(g.dx, g.vx, !!I18nManager.isRTL);
        if (delta) goMonthRef.current(delta);
      },
    })
  ).current.panHandlers;

  const slideStyle = useMemo(
    () => ({
      opacity: slide.interpolate({ inputRange: [-1, 0, 1], outputRange: [0, 1, 0] }),
      transform: [{ translateX: slide.interpolate({ inputRange: [-1, 0, 1], outputRange: [-SLIDE_DISTANCE, 0, SLIDE_DISTANCE] }) }],
    }),
    [slide]
  );

  const isArrowDisabled = useCallback(
    (direction: ArrowDirection) => view === 'days' && (direction === 'prev' ? !canPrev : !canNext),
    [canNext, canPrev, view]
  );

  const onArrowPress = useCallback(
    (direction: ArrowDirection) => {
      const delta = direction === 'prev' ? -1 : 1;
      if (view === 'days') goMonth(delta);
      else setMonth(shiftMonthForView(view, month, delta));
    },
    [goMonth, month, view]
  );

  const cycleView = useCallback(() => setView((current) => NEXT_VIEW[current]), []);

  const pickMonth = useCallback(
    (monthIndex: number) => {
      const next = new Date(month.getFullYear(), monthIndex, 1);
      setMonth(next);
      onMonthChange?.(next);
      setView('days');
    },
    [month, onMonthChange]
  );

  const pickYear = useCallback(
    (year: number) => {
      setMonth(new Date(year, month.getMonth(), 1));
      setView('months');
    },
    [month]
  );

  return {
    month,
    view,
    rtl,
    slideStyle,
    panHandlers,
    isArrowDisabled,
    onArrowPress,
    cycleView,
    pickMonth,
    pickYear,
  };
};
