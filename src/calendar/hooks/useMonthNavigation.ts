import { useCallback, useEffect, useState } from 'react';
import { I18nManager } from 'react-native';

import { useSlideIn } from '../../core/hooks/useSlideIn';
import { useSwipe } from '../../core/hooks/useSwipe';
import { addMonths, isSameMonth, startOfMonth, toDateKey } from '../../core/utils/date.utils';
import { ARROW_DIRECTION, CALENDAR_VIEW, NEXT_VIEW } from '../calendar.constants';
import type { ArrowDirection, CalendarView } from '../calendar.types';
import { canGoToMonth, shiftMonthForView } from '../calendar.utils';

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
  const [view, setView] = useState<CalendarView>(CALENDAR_VIEW.days);
  const slide = useSlideIn(animationDuration);

  const canPrev = canGoToMonth(month, -1, minDate, maxDate);
  const canNext = canGoToMonth(month, 1, minDate, maxDate);

  const followKey = followDate ? toDateKey(followDate) : '';
  // biome-ignore lint/correctness/useExhaustiveDependencies: only a new date from outside should move the calendar, not paging.
  useEffect(() => {
    if (followDate && view === CALENDAR_VIEW.days && !isSameMonth(followDate, month)) setMonth(startOfMonth(followDate));
  }, [followKey]);

  const goMonth = useCallback(
    (delta: number) => {
      if ((delta < 0 && !canPrev) || (delta > 0 && !canNext)) return;
      const next = addMonths(month, delta);
      setMonth(next);
      onMonthChange?.(next);
      slide.from(delta);
    },
    [canNext, canPrev, month, onMonthChange, slide]
  );

  const panHandlers = useSwipe(goMonth);

  const isArrowDisabled = useCallback(
    (direction: ArrowDirection) => view === CALENDAR_VIEW.days && (direction === ARROW_DIRECTION.prev ? !canPrev : !canNext),
    [canNext, canPrev, view]
  );

  const onArrowPress = useCallback(
    (direction: ArrowDirection) => {
      const delta = direction === ARROW_DIRECTION.prev ? -1 : 1;
      if (view === CALENDAR_VIEW.days) goMonth(delta);
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
      setView(CALENDAR_VIEW.days);
    },
    [month, onMonthChange]
  );

  const pickYear = useCallback(
    (year: number) => {
      setMonth(new Date(year, month.getMonth(), 1));
      setView(CALENDAR_VIEW.months);
    },
    [month]
  );

  return {
    month,
    view,
    rtl,
    slideStyle: slide.style,
    panHandlers,
    isArrowDisabled,
    onArrowPress,
    cycleView,
    pickMonth,
    pickYear,
  };
};
