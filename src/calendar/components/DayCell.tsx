import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { textStyle } from '../../core';
import { TouchFeedback } from '../../core/components/TouchFeedback';
import { useTouchFeedback } from '../../core/hooks/useTouchFeedback';
import { formatDate } from '../../core/utils/date.utils';
import { CALENDAR_DESIGN, MAX_MARKING_DOTS } from '../calendar.constants';
import { styles } from '../calendar.styles';
import type { DayCellProps } from '../calendar.types';
import { getDayLook, getDaySize, getDayTextColor, showsRangeBand } from '../calendar.utils';

const ACCESSIBLE_DATE: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };

export const DayCell = memo(({ state, hidden, hasRangeEnd, height, locale, renderDay, onSelect, theme, slots }: DayCellProps) => {
  const touch = useTouchFeedback(theme, state.disabled);
  if (hidden) return <View style={[styles.cell, { height }]} />;
  const { date, selected, disabled, outside, today, rangeStart, rangeEnd, marking } = state;
  const c = theme.colors;
  const size = getDaySize(height);
  const look = getDayLook(state, CALENDAR_DESIGN[theme.design]);
  const radius = CALENDAR_DESIGN[theme.design].squareDays ? theme.radius.sm : size / 2;

  return (
    <Pressable
      // A custom day has no circle to hold the effects, so they cover the whole cell instead.
      ref={renderDay ? touch.ref : undefined}
      {...touch.handlers}
      onPress={disabled ? undefined : () => onSelect(date)}
      style={[styles.cell, { height }, slots?.day]}
      accessibilityRole="button"
      accessibilityLabel={formatDate(date, locale, ACCESSIBLE_DATE)}
      accessibilityState={{ selected, disabled }}
    >
      {() => (
        <>
          {renderDay ? <TouchFeedback {...touch.feedback} /> : null}
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
              ref={touch.ref}
              style={[
                styles.dayInner,
                { width: size, height: size, borderRadius: radius },
                look.filled && { backgroundColor: c.primary },
                look.tinted && { backgroundColor: c.primaryMuted },
                look.todayRing && [styles.todayRing, { borderColor: c.primary }],
                look.todaySurface && { backgroundColor: c.surface },
                slots?.dayInner,
                today && slots?.todayDay,
                selected && slots?.selectedDay,
              ]}
            >
              <TouchFeedback {...touch.feedback} borderRadius={radius} />
              <Text
                style={[
                  textStyle(theme, 'md', selected || today ? 'bold' : 'regular'),
                  { color: getDayTextColor(state, c, look.tinted), textDecorationLine: disabled && !outside ? 'line-through' : 'none' },
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
                <Text style={[styles.dayLabel, { color: look.filled ? c.onPrimary : c.textSecondary }, slots?.dayLabel]} numberOfLines={1}>
                  {marking.label}
                </Text>
              ) : null}
              {marking?.dots?.length ? (
                <View style={styles.dots}>
                  {marking.dots.slice(0, MAX_MARKING_DOTS).map((color, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: dots are positional and may repeat a colour.
                    <View key={i} style={[styles.dot, { backgroundColor: look.filled ? c.onPrimary : color }, slots?.dot]} />
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
