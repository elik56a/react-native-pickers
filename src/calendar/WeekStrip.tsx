import { useMemo } from 'react';
import { Animated, View } from 'react-native';

import { formatMonthYear } from '../core/utils/date.utils';
import { ARROW_FOCUS } from '../core/utils/keyboard.utils';
import { CALENDAR_VIEW, DEFAULT_DAY_HEIGHT } from './calendar.constants';
import type { WeekStripProps } from './calendar.types';
import { getStripWeek, getWeekMonth } from './calendar.utils';
import { CalendarHeader } from './components/CalendarHeader';
import { DayGrid } from './components/DayGrid';
import { useDayCalendar } from './hooks/useDayCalendar';
import { useWeekNavigation } from './hooks/useWeekNavigation';

/** One week of days to pick from, under its month, with arrows and a swipe to the next or previous week. */
export const WeekStrip = (props: WeekStripProps) => {
  const {
    locale,
    minDate,
    maxDate,
    markedDates,
    initialWeek,
    onWeekChange,
    showHeader = true,
    enableSwipe = true,
    showWeekdays = true,
    formatTitle,
    renderDay,
    renderArrow,
    dayHeight = DEFAULT_DAY_HEIGHT,
    style,
    styles: slots,
    testID,
  } = props;
  const { theme, firstDayOfWeek, today, isDisabled, selection, select, weekdays } = useDayCalendar(props);
  const nav = useWeekNavigation({
    anchor: initialWeek ?? selection.single ?? today,
    firstDayOfWeek,
    followDate: selection.single,
    minDate,
    maxDate,
    onWeekChange,
    animationDuration: theme.animation.duration,
  });

  const week = useMemo(
    () => [getStripWeek(nav.weekStart, { today, selection, isDisabled, markedDates })],
    [isDisabled, markedDates, nav.weekStart, selection, today]
  );
  const title = formatTitle ? formatTitle(nav.weekStart, locale) : formatMonthYear(getWeekMonth(nav.weekStart), locale);

  return (
    <View
      style={[{ backgroundColor: theme.colors.background, paddingVertical: theme.spacing.sm }, style, slots?.container]}
      {...ARROW_FOCUS}
      testID={testID}
    >
      {showHeader && (
        <CalendarHeader
          label={title}
          accessibilityLabel={title}
          view={CALENDAR_VIEW.days}
          enableQuickJump={false}
          isArrowDisabled={nav.isArrowDisabled}
          onArrowPress={nav.onArrowPress}
          renderArrow={renderArrow}
          rtl={nav.rtl}
          theme={theme}
          slots={slots}
        />
      )}
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
