import { View } from 'react-native';

import { PickerText } from '../../core/components/PickerText';
import { AGENDA_LAYOUT } from '../schedule.constants';
import { styles } from '../schedule.styles';
import type { AgendaEventContentProps, ScheduleEvent } from '../schedule.types';
import { formatClock } from '../schedule.utils';

/**
 * An event in the agenda: on iOS its start over its end, a colored bar and the title; in Material a filled card with the
 * title over the time; on the web a dot, the time and the title on one line.
 */
export const AgendaEventContent = <T extends ScheduleEvent>({
  info,
  layout,
  locale,
  hour12,
  renderEvent,
  slots,
}: AgendaEventContentProps<T>) => {
  if (renderEvent) return renderEvent(info);
  const { event, start, end, allDay, timeText, colors, theme } = info;
  const subtitle = event.subtitle ? (
    <PickerText theme={theme} size="sm" color="textSecondary" numberOfLines={1} style={slots?.eventText}>
      {event.subtitle}
    </PickerText>
  ) : null;

  if (layout === AGENDA_LAYOUT.cards) {
    return (
      <>
        <PickerText theme={theme} size="sm" weight="medium" numberOfLines={1} style={[{ color: colors.text }, slots?.eventTitle]}>
          {event.title}
        </PickerText>
        <PickerText theme={theme} size="xs" numberOfLines={1} style={[{ color: colors.text, opacity: 0.85 }, slots?.eventText]}>
          {event.subtitle ? `${timeText} · ${event.subtitle}` : timeText}
        </PickerText>
      </>
    );
  }

  if (layout === AGENDA_LAYOUT.rows) {
    return (
      <>
        <View style={[styles.agendaDot, { backgroundColor: colors.background }]} />
        <PickerText theme={theme} size="sm" color="textSecondary" numberOfLines={1} style={[styles.agendaLineTime, slots?.eventText]}>
          {timeText}
        </PickerText>
        <View style={styles.flex}>
          <PickerText theme={theme} size="sm" weight="medium" numberOfLines={1} style={slots?.eventTitle}>
            {event.title}
          </PickerText>
          {subtitle}
        </View>
      </>
    );
  }

  return (
    <>
      <View style={styles.agendaTime}>
        <PickerText theme={theme} size="sm" numberOfLines={1} style={slots?.eventText}>
          {allDay ? timeText : formatClock(start, locale, hour12)}
        </PickerText>
        {!allDay && (
          <PickerText theme={theme} size="sm" color="textSecondary" numberOfLines={1} style={slots?.eventText}>
            {formatClock(end, locale, hour12)}
          </PickerText>
        )}
      </View>
      <View style={[styles.agendaBar, { backgroundColor: colors.bar ?? colors.background }]} />
      <View style={styles.agendaBody}>
        <PickerText theme={theme} size="md" weight="medium" numberOfLines={1} style={slots?.eventTitle}>
          {event.title}
        </PickerText>
        {subtitle}
      </View>
    </>
  );
};
