import { Touchable } from '../../core/components/Touchable';
import { ALL_DAY_CHIP_HEIGHT } from '../schedule.constants';
import { styles } from '../schedule.styles';
import type { AllDayChipProps, ScheduleEvent } from '../schedule.types';
import { EventContent } from './EventContent';

/** An all-day event in the row over the grid: one line, its title. */
export const AllDayChip = <T extends ScheduleEvent>({ info, renderEvent, onPress, onLongPress, slots }: AllDayChipProps<T>) => {
  const { event, colors, timeText, theme } = info;
  return (
    <Touchable
      theme={theme}
      onPress={onPress && (() => onPress(event))}
      onLongPress={onLongPress && (() => onLongPress(event))}
      disabled={!onPress && !onLongPress}
      style={[
        styles.allDayChip,
        !renderEvent && { backgroundColor: colors.background, borderRadius: theme.radius.sm / 2 },
        !renderEvent && !!colors.bar && styles.eventWithBar,
        slots?.event,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${event.title}, ${timeText}`}
    >
      <EventContent info={info} height={ALL_DAY_CHIP_HEIGHT} renderEvent={renderEvent} slots={slots} />
    </Touchable>
  );
};
