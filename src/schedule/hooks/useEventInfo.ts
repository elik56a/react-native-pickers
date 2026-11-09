import { useCallback } from 'react';

import type { PickerTheme } from '../../core/theme/theme.types';
import type { EventFill, EventInfoFor, ScheduleEvent, ScheduleLabels } from '../schedule.types';
import { formatEventTime, getEventColors } from '../schedule.utils';

interface UseEventInfoParams {
  locale?: string;
  hour12: boolean;
  labels: ScheduleLabels;
  fill: EventFill;
  theme: PickerTheme;
}

/** What an event draws with on a day: its time as text and its colors, the same in a timeline and an agenda. */
export const useEventInfo = <T extends ScheduleEvent>({ locale, hour12, labels, fill, theme }: UseEventInfoParams): EventInfoFor<T> =>
  useCallback(
    ({ event, start, end }, allDay) => ({
      event,
      start,
      end,
      allDay,
      timeText: formatEventTime({ start, end, allDay }, { locale, hour12, labels }),
      colors: getEventColors(event.color, fill, theme),
      theme,
    }),
    [fill, hour12, labels, locale, theme]
  );
