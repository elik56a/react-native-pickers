import { Text, View } from 'react-native';

import { textStyle } from '../../core';
import { CALENDAR_DESIGN } from '../calendar.constants';
import { styles } from '../calendar.styles';
import type { WeekdayRowProps } from '../calendar.types';

/** The weekday names over the days, in the design's case. */
export const WeekdayRow = ({ weekdays, theme, slots }: WeekdayRowProps) => (
  <View style={[styles.week, styles.weekdays, slots?.weekdays]}>
    {weekdays.map((weekday) => (
      <View key={weekday.key} style={styles.cell}>
        <Text
          style={[
            textStyle(theme, 'xs', 'medium'),
            styles.weekdayText,
            { color: theme.colors.textSecondary },
            CALENDAR_DESIGN[theme.design].uppercaseWeekdays && styles.uppercase,
            slots?.weekdayText,
          ]}
        >
          {weekday.label}
        </Text>
      </View>
    ))}
  </View>
);
