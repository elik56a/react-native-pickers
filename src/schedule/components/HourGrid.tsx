import { StyleSheet, View } from 'react-native';

import { styles } from '../schedule.styles';
import type { HourGridProps } from '../schedule.types';

/** The line across the grid at each hour, under the events and out of the way of taps. */
export const HourGrid = ({ hours, startHour, hourHeight, theme, slots }: HourGridProps) => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {hours.map((hour) => (
      <View
        key={hour}
        style={[
          styles.hourLine,
          { top: (hour - startHour) * hourHeight, borderTopWidth: StyleSheet.hairlineWidth, borderColor: theme.colors.border },
          slots?.hourLine,
        ]}
      />
    ))}
  </View>
);
