import { StyleSheet, View } from 'react-native';

import { Touchable } from '../../core/components/Touchable';
import { formatDate } from '../../core/utils/date.utils';
import { styles } from '../schedule.styles';
import type { TimelineDayHeaderProps } from '../schedule.types';
import { DayHeaderCell } from './DayHeaderCell';

const ACCESSIBLE_DATE: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };

/** The row of dates over the days' columns, each a button when `onDayPress` is set. */
export const TimelineDayHeader = ({
  days,
  todayIndex,
  locale,
  design,
  onDayPress,
  renderDayHeader,
  theme,
  slots,
}: TimelineDayHeaderProps) => (
  <View style={[styles.dayHeader, { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: theme.colors.border }, slots?.dayHeader]}>
    <View style={styles.gutter} />
    {days.map((date, i) => (
      <Touchable
        key={date.getTime()}
        theme={theme}
        disabled={!onDayPress}
        onPress={() => onDayPress?.(date)}
        style={[styles.flex, { borderRadius: theme.radius.sm }]}
        accessibilityRole={onDayPress ? 'button' : 'header'}
        accessibilityLabel={formatDate(date, locale, ACCESSIBLE_DATE)}
      >
        <DayHeaderCell
          info={{ date, today: i === todayIndex, theme }}
          locale={locale}
          inline={design.inlineDayHeader}
          uppercase={design.uppercaseWeekdays}
          renderDayHeader={renderDayHeader}
          slots={slots}
        />
      </Touchable>
    ))}
  </View>
);
