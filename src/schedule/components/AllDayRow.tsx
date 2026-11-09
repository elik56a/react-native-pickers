import { StyleSheet, View } from 'react-native';

import { PickerText } from '../../core/components/PickerText';
import { styles } from '../schedule.styles';
import type { AllDayRowProps, ScheduleEvent } from '../schedule.types';
import { AllDayChip } from './AllDayChip';

/** The all-day events over the grid, stacked under each day they cover. */
export const AllDayRow = <T extends ScheduleEvent>({
  columns,
  label,
  infoFor,
  renderEvent,
  onEventPress,
  onEventLongPress,
  theme,
  slots,
}: AllDayRowProps<T>) => (
  <View style={[styles.allDayRow, { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: theme.colors.border }, slots?.allDayRow]}>
    <View style={[styles.gutter, styles.allDayLabel]}>
      <PickerText theme={theme} size="xs" color="textSecondary" numberOfLines={2}>
        {label}
      </PickerText>
    </View>
    {columns.map(({ key, allDay }) => (
      <View key={key} style={styles.allDayColumn}>
        {allDay.map((event) => (
          <AllDayChip
            key={event.id}
            info={infoFor({ event, start: event.start, end: event.end }, true)}
            renderEvent={renderEvent}
            onPress={onEventPress}
            onLongPress={onEventLongPress}
            slots={slots}
          />
        ))}
      </View>
    ))}
  </View>
);
