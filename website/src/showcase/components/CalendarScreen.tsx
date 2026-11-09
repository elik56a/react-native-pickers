import { View } from 'react-native';

import { Agenda, ExpandableCalendar, HorizontalList, Timeline, usePickerTheme } from '@elik56a/react-native-pickers';
import { PLATFORM } from '../../home/device/device.constants';
import { useCalendar } from '../hooks/useCalendar';
import { CALENDAR_VIEW, CALENDAR_VIEWS } from '../showcase.constants';
import { styles } from '../showcase.styles';
import type { ScreenProps } from '../showcase.types';

/** A calendar app: a week that opens into its month over the day's hours, three days, or the events as a list. */
export const CalendarScreen = ({ platform }: ScreenProps) => {
  const { colors } = usePickerTheme();
  const calendar = useCalendar();
  return (
    <View style={[styles.chat, platform === PLATFORM.web && styles.browserChat, { backgroundColor: colors.background }]}>
      <ExpandableCalendar value={calendar.day} onChange={calendar.setDay} markedDates={calendar.marks} />
      <View style={styles.calendarViews}>
        <HorizontalList items={CALENDAR_VIEWS} value={calendar.view} onChange={calendar.setView} />
      </View>
      {calendar.view === CALENDAR_VIEW.list ? (
        <Agenda events={calendar.events} selectedDate={calendar.day} onVisibleDateChange={calendar.setDay} style={styles.calendarBody} />
      ) : (
        <Timeline
          events={calendar.events}
          date={calendar.day}
          onDateChange={calendar.setDay}
          numberOfDays={calendar.view === CALENDAR_VIEW.threeDays ? 3 : 1}
          onSlotPress={calendar.addEvent}
          onDayPress={calendar.setDay}
          style={styles.calendarBody}
        />
      )}
    </View>
  );
};
