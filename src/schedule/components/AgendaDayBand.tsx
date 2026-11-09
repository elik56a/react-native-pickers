import { View } from 'react-native';

import { PickerText } from '../../core/components/PickerText';
import { formatDate } from '../../core/utils/date.utils';
import { styles } from '../schedule.styles';
import type { AgendaDateProps } from '../schedule.types';

const BAND_DATE: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };

/** iOS's band over a day's events, which sticks to the top while they scroll under it. Today's is in the primary color. */
export const AgendaDayBand = ({ info, locale, renderDayHeader, slots }: AgendaDateProps) => {
  if (renderDayHeader) return renderDayHeader(info);
  const { date, today, theme } = info;
  const label = formatDate(date, locale, BAND_DATE);
  return (
    <View
      style={[styles.agendaBand, { backgroundColor: theme.colors.surface }, slots?.dayHeader]}
      accessible
      accessibilityRole="header"
      accessibilityLabel={label}
    >
      <PickerText theme={theme} size="sm" weight="bold" color={today ? 'primary' : 'text'} style={slots?.dayHeaderText}>
        {label}
      </PickerText>
    </View>
  );
};
