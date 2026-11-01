import { useMemo } from 'react';
import { Animated, View } from 'react-native';

import { buildMonthGrid, formatMonthYear, getMonthNames } from '../core/utils/date.utils';
import { ARROW_FOCUS } from '../core/utils/keyboard.utils';
import { CALENDAR_MODE, CALENDAR_VIEW, DEFAULT_DAY_HEIGHT } from './calendar.constants';
import type { CalendarProps } from './calendar.types';
import {
  getAnchorMonth,
  getHeaderLabel,
  getMonthCells,
  getQuickGridHeight,
  getWeekStates,
  getYearBounds,
  getYearCells,
  hasRangeEnd,
} from './calendar.utils';
import { CalendarHeader } from './components/CalendarHeader';
import { DayGrid } from './components/DayGrid';
import { QuickGrid } from './components/QuickGrid';
import { RangePresets } from './components/RangePresets';
import { useDayCalendar } from './hooks/useDayCalendar';
import { useMonthNavigation } from './hooks/useMonthNavigation';

export const Calendar = (props: CalendarProps) => {
  const {
    locale,
    minDate,
    maxDate,
    markedDates,
    initialMonth,
    onMonthChange,
    showOutsideDays = true,
    fixedWeeks = true,
    enableSwipe = true,
    enableQuickJump = true,
    showWeekdays = true,
    formatTitle,
    renderDay,
    renderArrow,
    yearRange,
    dayHeight = DEFAULT_DAY_HEIGHT,
    style,
    styles: slots,
    testID,
  } = props;
  const { theme, themeOverride, firstDayOfWeek, today, isDisabled, selection, select, selectRange, weekdays } = useDayCalendar(props);
  const range = props.mode === CALENDAR_MODE.range ? props : undefined;
  const nav = useMonthNavigation({
    anchor: getAnchorMonth(initialMonth, selection),
    followDate: selection.single ?? selection.range.start,
    minDate,
    maxDate,
    onMonthChange,
    animationDuration: theme.animation.duration,
  });
  const { month, view } = nav;

  const weeks = useMemo(
    () =>
      getWeekStates(buildMonthGrid(month.getFullYear(), month.getMonth(), firstDayOfWeek, fixedWeeks), {
        month,
        today,
        selection,
        isDisabled,
        markedDates,
      }),
    [firstDayOfWeek, fixedWeeks, isDisabled, markedDates, month, selection, today]
  );

  const title = formatTitle ? formatTitle(month, locale) : formatMonthYear(month, locale);
  const quickGridHeight = getQuickGridHeight(dayHeight, fixedWeeks, showWeekdays);

  return (
    <View
      style={[{ backgroundColor: theme.colors.background, paddingVertical: theme.spacing.sm }, style, slots?.container]}
      {...ARROW_FOCUS}
      testID={testID}
    >
      {range?.presets?.length ? (
        <RangePresets
          presets={range.presets}
          range={selection.range}
          rules={range}
          isDisabled={isDisabled}
          onSelect={selectRange}
          theme={themeOverride}
          listProps={range.presetsProps}
        />
      ) : null}
      <CalendarHeader
        label={getHeaderLabel(view, month, title)}
        accessibilityLabel={title}
        view={view}
        enableQuickJump={enableQuickJump}
        isArrowDisabled={nav.isArrowDisabled}
        onTitlePress={nav.cycleView}
        onArrowPress={nav.onArrowPress}
        renderArrow={renderArrow}
        rtl={nav.rtl}
        theme={theme}
        slots={slots}
      />
      {view === CALENDAR_VIEW.months && (
        <QuickGrid
          cells={getMonthCells(month, getMonthNames(locale, 'short'), minDate, maxDate)}
          height={quickGridHeight}
          onSelect={nav.pickMonth}
          theme={theme}
          slots={slots}
        />
      )}
      {view === CALENDAR_VIEW.years && (
        <QuickGrid
          cells={getYearCells(month, getYearBounds(today, yearRange, minDate, maxDate))}
          height={quickGridHeight}
          onSelect={nav.pickYear}
          theme={theme}
          slots={slots}
        />
      )}
      {view === CALENDAR_VIEW.days && (
        <Animated.View style={nav.slideStyle} {...(enableSwipe ? nav.panHandlers : {})}>
          <DayGrid
            weeks={weeks}
            weekdays={weekdays}
            showWeekdays={showWeekdays}
            showOutsideDays={showOutsideDays}
            hasRangeEnd={hasRangeEnd(selection)}
            dayHeight={dayHeight}
            locale={locale}
            renderDay={renderDay}
            onDayPress={select}
            theme={theme}
            slots={slots}
          />
        </Animated.View>
      )}
    </View>
  );
};
