import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import { useAnimatedValue } from '../../core/hooks/useAnimatedValue';
import { useDrag } from '../../core/hooks/useDrag';
import { timing } from '../../core/utils/animation.utils';
import { buildMonthGrid } from '../../core/utils/date.utils';
import type { CalendarExpansion } from '../calendar.types';
import { getCollapseDate, getDragProgress, getExpandMonth, getWeekRow, shouldExpand } from '../calendar.utils';

interface UseCalendarExpansionParams {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  weekStart: Date;
  month: Date;
  firstDayOfWeek: number;
  selected: Date | null;
  today: Date;
  rowHeight: number;
  duration: number;
  showWeek: (date: Date) => void;
  showMonth: (date: Date) => void;
}

/**
 * Opening a week into its month and folding it back, with the handle or a drag the month follows. The month grid is
 * drawn while open or moving, clipped to a height that grows from one row to all of them, and shifted up so the week it
 * opens from or folds into stays in place.
 */
export const useCalendarExpansion = ({
  expanded,
  setExpanded,
  weekStart,
  month,
  firstDayOfWeek,
  selected,
  today,
  rowHeight,
  duration,
  showWeek,
  showMonth,
}: UseCalendarExpansionParams): CalendarExpansion => {
  const progress = useAnimatedValue(expanded ? 1 : 0);
  const [showsMonth, setShowsMonth] = useState(expanded);
  const dragFrom = useRef(0);
  const grid = useMemo(() => buildMonthGrid(month.getFullYear(), month.getMonth(), firstDayOfWeek), [firstDayOfWeek, month]);
  const row = getWeekRow(grid, weekStart);
  const travel = (grid.length - 1) * rowHeight;

  const openMonth = () => {
    showMonth(getExpandMonth(weekStart, selected));
    setShowsMonth(true);
  };
  const animateTo = (open: boolean) =>
    timing(progress, open ? 1 : 0, { duration, native: false }).start(({ finished }) => {
      if (finished && !open) setShowsMonth(false);
    });

  const mountedOnce = useRef(false);
  // Before paint, so the month opens from the week shown and folds into the week of the day picked in it.
  // biome-ignore lint/correctness/useExhaustiveDependencies: only opening or folding moves the other view.
  useLayoutEffect(() => {
    if (!mountedOnce.current) {
      mountedOnce.current = true;
      return;
    }
    if (expanded) openMonth();
    else showWeek(getCollapseDate(month, selected, today));
    animateTo(expanded);
  }, [expanded]);

  const panHandlers = useDrag({
    vertical: true,
    onStart: () => {
      progress.stopAnimation((value) => {
        dragFrom.current = value;
      });
      if (!expanded) openMonth();
    },
    onMove: ({ dy }) => progress.setValue(getDragProgress(dragFrom.current, dy, travel)),
    onEnd: ({ dy, vy }) => {
      const open = shouldExpand(getDragProgress(dragFrom.current, dy, travel), vy, dragFrom.current);
      if (open === expanded) animateTo(open);
      else setExpanded(open);
    },
    onCancel: () => animateTo(expanded),
  });

  return {
    showsMonth,
    grid,
    panHandlers,
    clipStyle: { height: progress.interpolate({ inputRange: [0, 1], outputRange: [rowHeight, grid.length * rowHeight] }) },
    gridStyle: showsMonth
      ? { transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [-row * rowHeight, 0] }) }] }
      : undefined,
  };
};
