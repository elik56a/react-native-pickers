import { useMemo } from 'react';

import { DEFAULT_LIST_STEP_MINUTES } from '../time.constants';
import type { TimeListItem, TimeOptions } from '../time.types';
import { atSecondOfDay, getTimeBounds, getTimeListItems, getTimeListScrollIndex, secondsOfDay } from '../time.utils';

/** The times a list offers, which one is chosen, where to open, and how picking one changes the date. */
export const useTimeList = (date: Date, onChange: (date: Date) => void, options: TimeOptions, visibleRows: number) => {
  const { minuteInterval = 1, minTime, maxTime, format, locale } = options;
  const step = minuteInterval > 1 ? minuteInterval : DEFAULT_LIST_STEP_MINUTES;
  const day = date.toDateString();
  // biome-ignore lint/correctness/useExhaustiveDependencies: labels depend on the day (DST), not the time, so changing the time keeps the list.
  const items = useMemo(
    () => getTimeListItems(date, step, getTimeBounds(minTime, maxTime), { format, locale }),
    [day, step, minTime, maxTime, format, locale]
  );
  const second = secondsOfDay(date);

  return {
    items,
    selected: second,
    initialIndex: getTimeListScrollIndex(items, second, visibleRows),
    select: (item: TimeListItem) => onChange(atSecondOfDay(date, item.value)),
  };
};
