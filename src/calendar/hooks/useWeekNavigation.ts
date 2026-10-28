import { useCallback, useEffect, useState } from 'react';
import { I18nManager } from 'react-native';

import { useSlideIn } from '../../core/hooks/useSlideIn';
import { useSwipe } from '../../core/hooks/useSwipe';
import { addDays, isSameDay, toDateKey } from '../../core/utils/date.utils';
import { ARROW_DIRECTION, DAYS_PER_WEEK } from '../calendar.constants';
import type { ArrowDirection } from '../calendar.types';
import { canGoToWeek, getWeekStart } from '../calendar.utils';

interface UseWeekNavigationParams {
  anchor: Date;
  firstDayOfWeek: number;
  /** The selection: when it changes from outside to another week, the strip shows that week. */
  followDate: Date | null;
  minDate?: Date;
  maxDate?: Date;
  onWeekChange?: (weekStart: Date) => void;
  animationDuration: number;
}

/** The week shown, the slide between weeks, and the arrows and swipe that change it. */
export const useWeekNavigation = ({
  anchor,
  firstDayOfWeek,
  followDate,
  minDate,
  maxDate,
  onWeekChange,
  animationDuration,
}: UseWeekNavigationParams) => {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(anchor, firstDayOfWeek));
  const slide = useSlideIn(animationDuration);
  const canPrev = canGoToWeek(weekStart, -1, minDate, maxDate);
  const canNext = canGoToWeek(weekStart, 1, minDate, maxDate);

  const followKey = followDate ? toDateKey(followDate) : '';
  // biome-ignore lint/correctness/useExhaustiveDependencies: only a new date from outside should move the strip, not paging.
  useEffect(() => {
    if (!followDate) return;
    const start = getWeekStart(followDate, firstDayOfWeek);
    if (!isSameDay(start, weekStart)) setWeekStart(start);
  }, [followKey, firstDayOfWeek]);

  const goWeek = useCallback(
    (delta: number) => {
      if ((delta < 0 && !canPrev) || (delta > 0 && !canNext)) return;
      const next = addDays(weekStart, delta * DAYS_PER_WEEK);
      setWeekStart(next);
      onWeekChange?.(next);
      slide.from(delta);
    },
    [canNext, canPrev, onWeekChange, slide, weekStart]
  );

  const panHandlers = useSwipe(goWeek);

  return {
    weekStart,
    rtl: !!I18nManager.isRTL,
    slideStyle: slide.style,
    panHandlers,
    isArrowDisabled: (direction: ArrowDirection) => (direction === ARROW_DIRECTION.prev ? !canPrev : !canNext),
    onArrowPress: (direction: ArrowDirection) => goWeek(direction === ARROW_DIRECTION.prev ? -1 : 1),
  };
};
