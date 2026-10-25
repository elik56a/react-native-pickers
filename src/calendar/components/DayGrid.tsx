import { Text, View } from 'react-native';
import { textStyle } from '../../core';
import { styles } from '../calendar.styles';
import type { DayGridProps } from '../calendar.types';
import { DayCell } from './DayCell';

export const DayGrid = ({
  weeks,
  weekdays,
  showWeekdays,
  showOutsideDays,
  hasRangeEnd,
  dayHeight,
  locale,
  renderDay,
  onDayPress,
  theme,
  slots,
}: DayGridProps) => (
  <>
    {showWeekdays && (
      <View style={[styles.week, styles.weekdays, slots?.weekdays]}>
        {weekdays.map((weekday) => (
          <View key={weekday.key} style={styles.cell}>
            <Text style={[textStyle(theme, 'xs', 'medium'), styles.weekdayText, { color: theme.colors.textSecondary }, slots?.weekdayText]}>
              {weekday.label}
            </Text>
          </View>
        ))}
      </View>
    )}
    {weeks.map((week) => (
      <View key={week[0]?.date.getTime()} style={[styles.week, slots?.week]}>
        {week.map((state) => (
          <DayCell
            key={state.date.getTime()}
            state={state}
            hidden={state.outside && !showOutsideDays}
            hasRangeEnd={hasRangeEnd}
            height={dayHeight}
            locale={locale}
            renderDay={renderDay}
            onSelect={onDayPress}
            theme={theme}
            slots={slots}
          />
        ))}
      </View>
    ))}
  </>
);
