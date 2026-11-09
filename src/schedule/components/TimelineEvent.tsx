import { Touchable } from '../../core/components/Touchable';
import { styles } from '../schedule.styles';
import type { ScheduleEvent, TimelineEventProps } from '../schedule.types';
import { EventContent } from './EventContent';

/** An event's block on the grid, pressable, read by screen readers as its title and time. */
export const TimelineEvent = <T extends ScheduleEvent>({
  info,
  height,
  compact,
  renderEvent,
  onPress,
  onLongPress,
  slots,
}: TimelineEventProps<T>) => {
  const { event, colors, timeText, theme } = info;
  return (
    <Touchable
      theme={theme}
      onPress={onPress && (() => onPress(event))}
      onLongPress={onLongPress && (() => onLongPress(event))}
      disabled={!onPress && !onLongPress}
      style={[
        renderEvent
          ? styles.flex
          : [styles.event, { backgroundColor: colors.background, borderRadius: theme.radius.sm / 2 }, !!colors.bar && styles.eventWithBar],
        slots?.event,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${event.title}, ${timeText}`}
    >
      <EventContent info={info} height={height} compact={compact} renderEvent={renderEvent} slots={slots} />
    </Touchable>
  );
};
