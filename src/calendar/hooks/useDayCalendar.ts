import { useCallback, useMemo } from 'react';

import { useComponentTheme } from '../../core/theme/ThemeProvider';
import { getFirstDayOfWeek, getWeekdayNames } from '../../core/utils/date.utils';
import { CALENDAR_DESIGN } from '../calendar.constants';
import type { DayCalendarProps } from '../calendar.types';
import { isDayDisabled, orderWeekdays } from '../calendar.utils';
import { useCalendarSelection } from './useCalendarSelection';

/** What a calendar sets up before it draws: the theme, the selection, the disabled days and the weekday names. */
export const useDayCalendar = (props: DayCalendarProps) => {
  const {
    locale,
    minDate,
    maxDate,
    isDateDisabled,
    markedDates,
    firstDayOfWeek: firstDayOfWeekProp,
    weekdayFormat: weekdayFormatProp,
    theme: themeProp,
    design,
  } = props;
  const { theme, themeOverride } = useComponentTheme(themeProp, design);
  const weekdayFormat = weekdayFormatProp ?? CALENDAR_DESIGN[theme.design].weekdayFormat;
  const firstDayOfWeek = firstDayOfWeekProp ?? getFirstDayOfWeek(locale);
  const today = useMemo(() => new Date(), []);
  const isDisabled = useCallback(
    (day: Date) => isDayDisabled(day, { minDate, maxDate, isDateDisabled, markedDates }),
    [isDateDisabled, markedDates, maxDate, minDate]
  );
  const { selection, select, selectRange } = useCalendarSelection(props, isDisabled);
  const weekdays = useMemo(
    () => orderWeekdays(getWeekdayNames(locale, weekdayFormat), firstDayOfWeek),
    [firstDayOfWeek, locale, weekdayFormat]
  );
  return {
    theme,
    themeOverride,
    firstDayOfWeek,
    today,
    isDisabled,
    selection,
    select,
    selectRange,
    weekdays,
  };
};
