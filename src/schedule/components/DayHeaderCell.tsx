import { View } from 'react-native';

import { PickerText } from '../../core/components/PickerText';
import { formatDate } from '../../core/utils/date.utils';
import { DAY_HEADER_NUMBER_SIZE } from '../schedule.constants';
import { styles } from '../schedule.styles';
import type { DayHeaderCellProps } from '../schedule.types';

/** A day's weekday and date over its column: on one line on iOS, the weekday over the date elsewhere. Today's date is filled. */
export const DayHeaderCell = ({ info, locale, inline, uppercase, renderDayHeader, slots }: DayHeaderCellProps) => {
  if (renderDayHeader) return renderDayHeader(info);
  const { date, today, theme } = info;
  return (
    <View style={[styles.dayHeaderCell, inline && styles.dayHeaderInline]}>
      <PickerText
        theme={theme}
        size="xs"
        weight={today ? 'medium' : 'regular'}
        color={today ? 'primary' : 'textSecondary'}
        style={[uppercase && styles.uppercase, slots?.dayHeaderText]}
      >
        {formatDate(date, locale, { weekday: 'short' })}
      </PickerText>
      <View
        style={[
          styles.dayNumber,
          { width: DAY_HEADER_NUMBER_SIZE, height: DAY_HEADER_NUMBER_SIZE, borderRadius: DAY_HEADER_NUMBER_SIZE / 2 },
          today && { backgroundColor: theme.colors.primary },
        ]}
      >
        <PickerText
          theme={theme}
          size={inline ? 'sm' : 'md'}
          weight="medium"
          color={today ? 'onPrimary' : 'text'}
          style={slots?.dayHeaderText}
        >
          {formatDate(date, locale, { day: 'numeric' })}
        </PickerText>
      </View>
    </View>
  );
};
