import { View } from 'react-native';

import { PickerText } from '../../core/components/PickerText';
import { formatDate } from '../../core/utils/date.utils';
import { AGENDA_LAYOUT } from '../schedule.constants';
import { styles } from '../schedule.styles';
import type { AgendaDateProps } from '../schedule.types';

const ACCESSIBLE_DATE: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };

/**
 * The date beside a day's first event: the weekday over the day in Material, the day then "NOV, MON" on the web, as
 * Google Calendar's schedule draws them. Today's day sits in a filled circle.
 */
export const AgendaDate = ({ info, locale, layout, renderDayHeader, slots }: AgendaDateProps) => {
  if (renderDayHeader) return renderDayHeader(info);
  const { date, today, theme } = info;
  const rows = layout === AGENDA_LAYOUT.rows;
  const caption = rows
    ? `${formatDate(date, locale, { month: 'short' })}, ${formatDate(date, locale, { weekday: 'short' })}`
    : formatDate(date, locale, { weekday: 'short' });
  return (
    <View
      style={[rows ? styles.agendaDateRows : styles.agendaDate, slots?.date]}
      accessible
      accessibilityRole="header"
      accessibilityLabel={formatDate(date, locale, ACCESSIBLE_DATE)}
    >
      {!rows && (
        <PickerText theme={theme} size="xs" color={today ? 'primary' : 'textSecondary'} style={slots?.dayHeaderText}>
          {caption}
        </PickerText>
      )}
      <View style={[styles.agendaDayNumber, today && { backgroundColor: theme.colors.primary }]}>
        <PickerText theme={theme} size="lg" weight="medium" color={today ? 'onPrimary' : 'text'} style={slots?.dayHeaderText}>
          {formatDate(date, locale, { day: 'numeric' })}
        </PickerText>
      </View>
      {rows && (
        <PickerText theme={theme} size="xs" color={today ? 'primary' : 'textSecondary'} style={[styles.uppercase, slots?.dayHeaderText]}>
          {caption}
        </PickerText>
      )}
    </View>
  );
};
