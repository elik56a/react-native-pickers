import { Text, View } from 'react-native';

import { textStyle } from '../../core';
import { CALENDAR_DESIGN } from '../calendar.constants';
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
    )}
    {weeks.map((week, row) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: keyed by grid slot so a month change updates the cells instead of remounting them.
      <View key={row} style={[styles.week, slots?.week]}>
        {week.map((state, column) => (
          <DayCell
            // biome-ignore lint/suspicious/noArrayIndexKey: as above.
            key={column}
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
