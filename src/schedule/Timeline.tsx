import { Animated, ScrollView, View } from 'react-native';

import { SHOWS_SCROLL_INDICATOR } from '../core/core.constants';
import { AllDayRow } from './components/AllDayRow';
import { DayColumn } from './components/DayColumn';
import { HourGrid } from './components/HourGrid';
import { HourGutter } from './components/HourGutter';
import { NowIndicator } from './components/NowIndicator';
import { TimelineDayHeader } from './components/TimelineDayHeader';
import { useTimeline } from './hooks/useTimeline';
import { styles } from './schedule.styles';
import type { ScheduleEvent, TimelineProps } from './schedule.types';
import { getHours } from './schedule.utils';

/**
 * A day, or up to a week of days side by side, on a grid of hours: events placed by their time, side by side where they
 * overlap, all-day events over the grid, and a line at the current time. Swipe to the next days; tap the grid to add.
 */
export const Timeline = <T extends ScheduleEvent>(props: TimelineProps<T>) => {
  const {
    locale,
    showDayHeader,
    enableSwipe = true,
    onDayPress,
    onEventPress,
    onEventLongPress,
    renderEvent,
    renderDayHeader,
    style,
    styles: slots,
    testID,
  } = props;
  const t = useTimeline(props);
  const { theme, design, columns, startHour, endHour, hourHeight } = t;
  const hours = getHours(startHour, endHour);
  const days = columns.map((column) => column.day);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }, style, slots?.container]} testID={testID}>
      <Animated.View style={t.slideStyle} {...(enableSwipe ? t.panHandlers : {})}>
        {(showDayHeader ?? columns.length > 1) && (
          <TimelineDayHeader
            days={days}
            todayIndex={t.todayIndex}
            locale={locale}
            design={design}
            onDayPress={onDayPress}
            renderDayHeader={renderDayHeader}
            theme={theme}
            slots={slots}
          />
        )}
        {t.hasAllDay && (
          <AllDayRow
            columns={columns}
            label={t.labels.allDay}
            infoFor={t.infoFor}
            renderEvent={renderEvent}
            onEventPress={onEventPress}
            onEventLongPress={onEventLongPress}
            theme={theme}
            slots={slots}
          />
        )}
      </Animated.View>
      <ScrollView
        ref={t.scrollRef}
        onLayout={t.onScrollLayout}
        onContentSizeChange={t.onContentSizeChange}
        showsVerticalScrollIndicator={SHOWS_SCROLL_INDICATOR}
      >
        <Animated.View style={[styles.grid, t.slideStyle]} {...(enableSwipe ? t.panHandlers : {})}>
          <HourGutter
            hours={hours}
            startHour={startHour}
            hourHeight={hourHeight}
            hour12={t.hour12}
            locale={locale}
            now={t.now}
            nowOffset={t.nowOffset}
            design={design}
            theme={theme}
            slots={slots}
          />
          <View style={[styles.row, styles.flex, { height: (endHour - startHour) * hourHeight }]}>
            <HourGrid hours={hours} startHour={startHour} hourHeight={hourHeight} theme={theme} slots={slots} />
            {columns.map(({ key, day, segments }, i) => (
              <DayColumn
                key={key}
                day={day}
                segments={segments}
                first={i === 0}
                startHour={startHour}
                hourHeight={hourHeight}
                infoFor={t.infoFor}
                onPressSlot={t.pressSlot}
                renderEvent={renderEvent}
                onEventPress={onEventPress}
                onEventLongPress={onEventLongPress}
                theme={theme}
                slots={slots}
                testID={testID && `${testID}.${key}`}
              />
            ))}
            {t.nowOffset !== null && (
              <NowIndicator
                offset={t.nowOffset}
                dayIndex={t.todayIndex}
                days={columns.length}
                design={design}
                theme={theme}
                slots={slots}
              />
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};
