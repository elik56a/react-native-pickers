import { View } from 'react-native';

import { styles } from '../calendar.styles';
import type { DayGridProps } from '../calendar.types';
import { DayCell } from './DayCell';
import { WeekdayRow } from './WeekdayRow';

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
    {showWeekdays && <WeekdayRow weekdays={weekdays} theme={theme} slots={slots} />}
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
