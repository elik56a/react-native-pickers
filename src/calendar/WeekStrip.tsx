import { useCallback, useMemo } from 'react';
import { Animated, View } from 'react-native';

import { usePickerTheme } from '../core';
import { useDesignOverride } from '../core/theme/ThemeProvider';
import { formatMonthYear, getFirstDayOfWeek, getWeekdayNames } from '../core/utils/date.utils';
import { ARROW_FOCUS } from '../core/utils/keyboard.utils';
import { CALENDAR_DESIGN, CALENDAR_VIEW, DEFAULT_DAY_HEIGHT } from './calendar.constants';
import type { WeekStripProps } from './calendar.types';
import { getDayState, getWeekDays, getWeekMonth, isDayDisabled, orderWeekdays } from './calendar.utils';
import { CalendarHeader } from './components/CalendarHeader';
import { DayGrid } from './components/DayGrid';
import { useCalendarSelection } from './hooks/useCalendarSelection';
import { useWeekNavigation } from './hooks/useWeekNavigation';

const noop = () => {};

/** One week of days to pick from, under its month, with arrows and a swipe to the next or previous week. */
export const WeekStrip = ({
  value,
  defaultValue,
  onChange,
  locale,
  minDate,
  maxDate,
  isDateDisabled,
  firstDayOfWeek: firstDayOfWeekProp,
  markedDates,
  initialWeek,
  onWeekChange,
  showHeader = true,
  enableSwipe = true,
  weekdayFormat: weekdayFormatProp,
  showWeekdays = true,
  formatTitle,
  renderDay,
  renderArrow,
  dayHeight = DEFAULT_DAY_HEIGHT,
  style,
  styles: slots,
  theme: themeProp,
  design,
  testID,
}: WeekStripProps) => {
  const themeOverride = useDesignOverride(themeProp, design);
  const theme = usePickerTheme(themeOverride);
  const weekdayFormat = weekdayFormatProp ?? CALENDAR_DESIGN[theme.design].weekdayFormat;
  const firstDayOfWeek = firstDayOfWeekProp ?? getFirstDayOfWeek(locale);
  const today = useMemo(() => new Date(), []);

  const isDisabled = useCallback(
    (day: Date) => isDayDisabled(day, { minDate, maxDate, isDateDisabled, markedDates }),
    [isDateDisabled, markedDates, maxDate, minDate]
  );
  const { selection, select } = useCalendarSelection({ value, defaultValue, onChange }, isDisabled);
  const nav = useWeekNavigation({
    anchor: initialWeek ?? selection.single ?? today,
    firstDayOfWeek,
    followDate: selection.single,
    minDate,
    maxDate,
    onWeekChange,
    animationDuration: theme.animation.duration,
  });

  // Each day is its own month, so none is dimmed as outside it.
  const week = useMemo(
    () => [getWeekDays(nav.weekStart).map((date) => getDayState({ date, month: date, today, selection, isDisabled, markedDates }))],
    [isDisabled, markedDates, nav.weekStart, selection, today]
  );
  const weekdays = useMemo(
    () => orderWeekdays(getWeekdayNames(locale, weekdayFormat), firstDayOfWeek),
    [firstDayOfWeek, locale, weekdayFormat]
  );
  const title = formatTitle ? formatTitle(nav.weekStart, locale) : formatMonthYear(getWeekMonth(nav.weekStart), locale);

  return (
    <View
      style={[{ backgroundColor: theme.colors.background, paddingVertical: theme.spacing.sm }, style, slots?.container]}
      {...ARROW_FOCUS}
      testID={testID}
    >
      {showHeader ? (
        <CalendarHeader
          label={title}
          accessibilityLabel={title}
          view={CALENDAR_VIEW.days}
          enableQuickJump={false}
          isArrowDisabled={nav.isArrowDisabled}
          onTitlePress={noop}
          onArrowPress={nav.onArrowPress}
          renderArrow={renderArrow}
          rtl={nav.rtl}
          theme={theme}
          slots={slots}
        />
      ) : null}
      <Animated.View style={nav.slideStyle} {...(enableSwipe ? nav.panHandlers : {})}>
        <DayGrid
          weeks={week}
          weekdays={weekdays}
          showWeekdays={showWeekdays}
          showOutsideDays
          hasRangeEnd={false}
          dayHeight={dayHeight}
          locale={locale}
          renderDay={renderDay}
          onDayPress={select}
          theme={theme}
          slots={slots}
        />
      </Animated.View>
    </View>
  );
};
