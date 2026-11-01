import { useMemo } from 'react';
import { Animated, View } from 'react-native';

import { useControllableState } from '../core/hooks/useControllableState';
import { formatMonthYear, startOfMonth } from '../core/utils/date.utils';
import { ARROW_FOCUS } from '../core/utils/keyboard.utils';
import { CALENDAR_VIEW, DEFAULT_DAY_HEIGHT } from './calendar.constants';
import { styles } from './calendar.styles';
import type { ExpandableCalendarProps } from './calendar.types';
import { getStripWeek, getWeekMonth, getWeekStates } from './calendar.utils';
import { CalendarHeader } from './components/CalendarHeader';
import { DayGrid } from './components/DayGrid';
import { ExpandHandle } from './components/ExpandHandle';
import { WeekdayRow } from './components/WeekdayRow';
import { useCalendarExpansion } from './hooks/useCalendarExpansion';
import { useDayCalendar } from './hooks/useDayCalendar';
import { useMonthNavigation } from './hooks/useMonthNavigation';
import { useWeekNavigation } from './hooks/useWeekNavigation';

const noop = () => {};

/** A week of days that opens into its month, by the handle under it or a drag down that it follows, and folds back into a week. */
export const ExpandableCalendar = (props: ExpandableCalendarProps) => {
  const {
    expanded: expandedProp,
    defaultExpanded = false,
    onExpandedChange,
    initialDate,
    onWeekChange,
    onMonthChange,
    locale,
    minDate,
    maxDate,
    markedDates,
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
  const [expanded, setExpanded] = useControllableState(expandedProp, () => defaultExpanded, onExpandedChange);
  const anchor = initialDate ?? selection.single ?? today;
  const navigation = { followDate: selection.single, minDate, maxDate, animationDuration: theme.animation.duration };
  const week = useWeekNavigation({ ...navigation, anchor, firstDayOfWeek, onWeekChange });
  const month = useMonthNavigation({ ...navigation, anchor: startOfMonth(anchor), onMonthChange });
  const expansion = useCalendarExpansion({
    expanded,
    setExpanded,
    weekStart: week.weekStart,
    month: month.month,
    firstDayOfWeek,
    selected: selection.single,
    today,
    rowHeight: dayHeight,
    duration: theme.animation.duration,
    showWeek: week.showWeek,
    showMonth: month.showMonth,
  });

  const weeks = useMemo(
    () =>
      expansion.showsMonth
        ? getWeekStates(expansion.grid, { month: month.month, today, selection, isDisabled, markedDates })
        : [getStripWeek(week.weekStart, { today, selection, isDisabled, markedDates })],
    [expansion.grid, expansion.showsMonth, isDisabled, markedDates, month.month, selection, today, week.weekStart]
  );
  const nav = expanded ? month : week;
  const shown = expanded ? month.month : getWeekMonth(week.weekStart);
  const title = formatTitle ? formatTitle(shown, locale) : formatMonthYear(shown, locale);

  return (
    <View
      style={[{ backgroundColor: theme.colors.background, paddingTop: theme.spacing.sm }, style, slots?.container]}
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
          onTitlePress={noop}
          onArrowPress={nav.onArrowPress}
          renderArrow={renderArrow}
          rtl={nav.rtl}
          theme={theme}
          slots={slots}
        />
      )}
      <View {...(enableSwipe ? expansion.panHandlers : {})}>
        {showWeekdays && <WeekdayRow weekdays={weekdays} theme={theme} slots={slots} />}
        <Animated.View style={[styles.expandClip, expansion.clipStyle]}>
          <Animated.View style={expansion.gridStyle}>
            <Animated.View style={nav.slideStyle} {...(enableSwipe ? nav.panHandlers : {})}>
              <DayGrid
                weeks={weeks}
                weekdays={weekdays}
                showWeekdays={false}
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
          </Animated.View>
        </Animated.View>
        <ExpandHandle expanded={expanded} onPress={() => setExpanded(!expanded)} theme={theme} slots={slots} />
      </View>
    </View>
  );
};
