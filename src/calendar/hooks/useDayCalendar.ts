import { useCallback, useMemo } from 'react';

import { usePickerTheme } from '../../core';
import { useDesignOverride } from '../../core/theme/ThemeProvider';
import { getFirstDayOfWeek, getWeekdayNames } from '../../core/utils/date.utils';
import { CALENDAR_DESIGN } from '../calendar.constants';
import type { WeekStripProps } from '../calendar.types';
import { isDayDisabled, orderWeekdays } from '../calendar.utils';
import { useCalendarSelection } from './useCalendarSelection';

/** What a one-day calendar sets up before it draws: the theme, the selected day, the disabled days and the weekday names. */
export const useDayCalendar = ({
  value,
  defaultValue,
  onChange,
  locale,
  minDate,
  maxDate,
  isDateDisabled,
  markedDates,
  firstDayOfWeek: firstDayOfWeekProp,
  weekdayFormat: weekdayFormatProp,
  theme: themeProp,
  design,
}: WeekStripProps) => {
  const theme = usePickerTheme(useDesignOverride(themeProp, design));
  const weekdayFormat = weekdayFormatProp ?? CALENDAR_DESIGN[theme.design].weekdayFormat;
  const firstDayOfWeek = firstDayOfWeekProp ?? getFirstDayOfWeek(locale);
  const today = useMemo(() => new Date(), []);
  const isDisabled = useCallback(
    (day: Date) => isDayDisabled(day, { minDate, maxDate, isDateDisabled, markedDates }),
    [isDateDisabled, markedDates, maxDate, minDate]
  );
  const { selection, select } = useCalendarSelection({ value, defaultValue, onChange }, isDisabled);
  const weekdays = useMemo(
    () => orderWeekdays(getWeekdayNames(locale, weekdayFormat), firstDayOfWeek),
    [firstDayOfWeek, locale, weekdayFormat]
  );
  return {
    theme,
    firstDayOfWeek,
    today,
    isDisabled,
    selection,
    select,
    weekdays,
  };
};
