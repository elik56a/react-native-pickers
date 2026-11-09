import { View } from 'react-native';

import { PickerText } from '../../core/components/PickerText';
import { EVENT_LINE_HEIGHT } from '../schedule.constants';
import { styles } from '../schedule.styles';
import type { EventContentProps, ScheduleEvent } from '../schedule.types';

/** What's inside an event's block on the grid: its title, then its time and subtitle where the block is tall enough. */
export const EventContent = <T extends ScheduleEvent>({ info, height, renderEvent, slots }: EventContentProps<T>) => {
  if (renderEvent) return renderEvent(info);
  const { event, colors, timeText, theme } = info;
  const lines = Math.max(1, Math.floor((height - 4) / EVENT_LINE_HEIGHT));
  const textStyle = [{ color: colors.text, opacity: 0.85 }, slots?.eventText];
  return (
    <>
      {colors.bar ? <View style={[styles.eventBar, { backgroundColor: colors.bar }]} /> : null}
      <PickerText
        theme={theme}
        size="xs"
        weight="medium"
        numberOfLines={lines > 2 ? 2 : 1}
        style={[{ color: colors.text }, slots?.eventTitle]}
      >
        {event.title}
      </PickerText>
      {lines > 1 && (
        <PickerText theme={theme} size="xs" numberOfLines={1} style={textStyle}>
          {timeText}
        </PickerText>
      )}
      {lines > 3 && !!event.subtitle && (
        <PickerText theme={theme} size="xs" numberOfLines={1} style={textStyle}>
          {event.subtitle}
        </PickerText>
      )}
    </>
  );
};
