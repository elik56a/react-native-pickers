import { View } from 'react-native';

import { PickerText } from '../../core/components/PickerText';
import { CALENDAR_DESIGN } from '../calendar.constants';
import { styles } from '../calendar.styles';
import type { WeekdayRowProps } from '../calendar.types';

/** The weekday names over the days, in the design's case. */
export const WeekdayRow = ({ weekdays, theme, slots }: WeekdayRowProps) => (
  <View style={[styles.week, styles.weekdays, slots?.weekdays]}>
    {weekdays.map((weekday) => (
      <View key={weekday.key} style={styles.cell}>
        <PickerText
          theme={theme}
          size="xs"
          weight="medium"
          color="textSecondary"
          style={[styles.weekdayText, CALENDAR_DESIGN[theme.design].uppercaseWeekdays && styles.uppercase, slots?.weekdayText]}
        >
          {weekday.label}
        </PickerText>
      </View>
    ))}
  </View>
);
