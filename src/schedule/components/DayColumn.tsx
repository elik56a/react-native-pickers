import { Pressable, StyleSheet, View } from 'react-native';

import { COMPACT_EVENT_WIDTH, MIN_EVENT_HEIGHT } from '../schedule.constants';
import { styles } from '../schedule.styles';
import type { DayColumnProps, ScheduleEvent } from '../schedule.types';
import { getSegmentFrame } from '../schedule.utils';
import { TimelineEvent } from './TimelineEvent';

/** A day's column of the grid: its events placed by time, side by side where they overlap, and a tap on the empty part. */
export const DayColumn = <T extends ScheduleEvent>({
  day,
  segments,
  days,
  first,
  startHour,
  hourHeight,
  infoFor,
  onPressSlot,
  renderEvent,
  onEventPress,
  onEventLongPress,
  theme,
  slots,
  testID,
}: DayColumnProps<T>) => (
  <Pressable
    // Only taps on the column itself reach here, so `locationY` is measured from its top; events take their own taps.
    onPress={onPressSlot && ((e) => onPressSlot(day, e))}
    disabled={!onPressSlot}
    accessible={false}
    testID={testID}
    style={[styles.dayColumn, !first && { borderStartWidth: StyleSheet.hairlineWidth, borderColor: theme.colors.border }, slots?.dayColumn]}
  >
    {segments.map((segment) => {
      const { top, height } = getSegmentFrame(segment, { startHour, hourHeight, minHeight: MIN_EVENT_HEIGHT });
      return (
        <View
          key={segment.event.id}
          style={[
            styles.eventSlot,
            {
              top,
              height,
              start: `${(segment.column / segment.columns) * 100}%`,
              width: `${(segment.span / segment.columns) * 100}%`,
            },
          ]}
        >
          <TimelineEvent
            info={infoFor(segment, false)}
            height={height}
            compact={segment.span / segment.columns / days < COMPACT_EVENT_WIDTH}
            renderEvent={renderEvent}
            onPress={onEventPress}
            onLongPress={onEventLongPress}
            slots={slots}
          />
        </View>
      );
    })}
  </Pressable>
);
