import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { textStyle } from '../../core';
import { formatDate } from '../../core/utils/date.utils';
import { MAX_MARKING_DOTS } from '../calendar.constants';
import { styles } from '../calendar.styles';
import type { DayCellProps } from '../calendar.types';
import { getDaySize, getDayTextColor, showsRangeBand } from '../calendar.utils';

const ACCESSIBLE_DATE: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };

export const DayCell = memo(({ state, hidden, hasRangeEnd, height, locale, renderDay, onSelect, theme, slots }: DayCellProps) => {
  if (hidden) return <View style={[styles.cell, { height }]} />;
  const { date, selected, disabled, outside, today, rangeStart, rangeEnd, marking } = state;
  const c = theme.colors;
  const size = getDaySize(height);

  return (
    <Pressable
      onPress={disabled ? undefined : () => onSelect(date)}
      style={[styles.cell, { height }, slots?.day]}
      accessibilityRole="button"
      accessibilityLabel={formatDate(date, locale, ACCESSIBLE_DATE)}
      accessibilityState={{ selected, disabled }}
    >
      {({ pressed }) => (
        <>
          {showsRangeBand(state, hasRangeEnd) && (
            <View
              style={[
                styles.band,
                { top: (height - size) / 2, height: size, backgroundColor: c.primaryMuted },
                rangeStart ? styles.bandFromCenter : rangeEnd ? styles.bandToCenter : null,
                slots?.rangeBand,
              ]}
            />
          )}
          {renderDay ? (
            renderDay(state, theme)
          ) : (
            <View
              style={[
                styles.dayInner,
                { width: size, height: size, borderRadius: size / 2 },
                selected && { backgroundColor: c.primary },
                !selected && pressed && !disabled && { backgroundColor: c.surface },
                !selected && today && [styles.todayRing, { borderColor: c.primary }],
                slots?.dayInner,
                today && slots?.todayDay,
                selected && slots?.selectedDay,
              ]}
            >
              <Text
                style={[
                  textStyle(theme, 'md', selected || today ? 'bold' : 'regular'),
                  { color: getDayTextColor(state, c), textDecorationLine: disabled && !outside ? 'line-through' : 'none' },
                  slots?.dayText,
                  outside && slots?.outsideDayText,
                  disabled && slots?.disabledDayText,
                  today && slots?.todayDayText,
                  selected && slots?.selectedDayText,
                ]}
              >
                {date.getDate()}
              </Text>
              {marking?.label ? (
                <Text style={[styles.dayLabel, { color: selected ? c.onPrimary : c.textSecondary }, slots?.dayLabel]} numberOfLines={1}>
                  {marking.label}
                </Text>
              ) : null}
              {marking?.dots?.length ? (
                <View style={styles.dots}>
                  {marking.dots.slice(0, MAX_MARKING_DOTS).map((color, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: dots are positional and may repeat a colour.
                    <View key={i} style={[styles.dot, { backgroundColor: selected ? c.onPrimary : color }, slots?.dot]} />
                  ))}
                </View>
              ) : null}
            </View>
          )}
        </>
      )}
    </Pressable>
  );
});
