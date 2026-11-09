import { StyleSheet, View } from 'react-native';

import { PickerText } from '../../core/components/PickerText';
import { Touchable } from '../../core/components/Touchable';
import { AGENDA_DATE_WIDTH, AGENDA_LAYOUT, ROW_KIND } from '../schedule.constants';
import { styles } from '../schedule.styles';
import type { AgendaItemProps, ScheduleEvent } from '../schedule.types';
import { AgendaDate } from './AgendaDate';
import { AgendaDayBand } from './AgendaDayBand';
import { AgendaEventContent } from './AgendaEventContent';

const EVENT_STYLE = {
  [AGENDA_LAYOUT.list]: styles.agendaRow,
  [AGENDA_LAYOUT.cards]: styles.agendaCard,
  [AGENDA_LAYOUT.rows]: styles.agendaLine,
};

/** One row of the agenda: a day's band, an event, or an empty day's "No events", with the date beside the first in Material and on the web. */
export const AgendaItem = <T extends ScheduleEvent>({
  row,
  today,
  layout,
  locale,
  hour12,
  labels,
  infoFor,
  renderEvent,
  renderDayHeader,
  onEventPress,
  onEventLongPress,
  theme,
  slots,
}: AgendaItemProps<T>) => {
  const dayInfo = { date: row.date, today, theme };
  if (row.kind === ROW_KIND.header)
    return <AgendaDayBand info={dayInfo} locale={locale} layout={layout} renderDayHeader={renderDayHeader} slots={slots} />;
  const list = layout === AGENDA_LAYOUT.list;
  const info = row.segment ? infoFor(row.segment, row.allDay) : null;
  const line = { borderColor: theme.colors.border };

  return (
    <View
      style={[
        styles.agendaRow,
        list && [line, { borderBottomWidth: StyleSheet.hairlineWidth }],
        layout === AGENDA_LAYOUT.rows && row.first && [line, { borderTopWidth: StyleSheet.hairlineWidth }],
      ]}
    >
      {!list && (
        <View style={{ width: AGENDA_DATE_WIDTH[layout] }}>
          {row.first && <AgendaDate info={dayInfo} locale={locale} layout={layout} renderDayHeader={renderDayHeader} slots={slots} />}
        </View>
      )}
      {info ? (
        <Touchable
          theme={theme}
          onPress={onEventPress && (() => onEventPress(info.event))}
          onLongPress={onEventLongPress && (() => onEventLongPress(info.event))}
          disabled={!onEventPress && !onEventLongPress}
          style={[
            renderEvent ? styles.flex : EVENT_STYLE[layout],
            !renderEvent && layout === AGENDA_LAYOUT.cards && { backgroundColor: info.colors.background, borderRadius: theme.radius.sm },
            list && styles.flex,
            slots?.event,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`${info.event.title}, ${info.timeText}`}
        >
          <AgendaEventContent info={info} layout={layout} locale={locale} hour12={hour12} renderEvent={renderEvent} slots={slots} />
        </Touchable>
      ) : (
        <View style={styles.agendaEmpty}>
          <PickerText theme={theme} size="sm" color="textSecondary" style={slots?.emptyText}>
            {labels.noEvents}
          </PickerText>
        </View>
      )}
    </View>
  );
};
