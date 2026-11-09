import { useCallback, useMemo, useState } from 'react';

import type { ScheduleEvent, TimeSlot } from '@elik56a/react-native-pickers';
import { startOfToday } from '../../home/demo/demo.utils';
import { CALENDAR_EVENTS, CALENDAR_VIEW, NEW_EVENT } from '../showcase.constants';
import type { CalendarView } from '../showcase.types';
import { buildCalendarEvents, calendarMarks } from '../showcase.utils';

/** The calendar screen: the day picked, the view, and the events, with one added for each tap on an empty hour. */
export const useCalendar = () => {
  const [day, setDay] = useState(startOfToday);
  const [view, setView] = useState<CalendarView>(CALENDAR_VIEW.day);
  const [events, setEvents] = useState(() => buildCalendarEvents(CALENDAR_EVENTS));
  const marks = useMemo(() => calendarMarks(events), [events]);

  const addEvent = useCallback(
    ({ start, end }: TimeSlot) =>
      setEvents((current): ScheduleEvent[] => [...current, { id: `new-${current.length}`, ...NEW_EVENT, start, end }]),
    []
  );

  return {
    day,
    setDay,
    view,
    setView,
    events,
    marks,
    addEvent,
  };
};
