import { View } from 'react-native';

import { Calendar } from '../../calendar/Calendar';
import { TimePicker } from '../../time/TimePicker';
import { TIME_DISPLAY } from '../../time/time.constants';
import { CALENDAR_TIME_VISIBLE_ITEMS } from '../datetime.constants';
import { styles } from '../datetime.styles';
import type { DateTimeViewProps } from '../datetime.types';
import { getDayTimeBounds, withDay } from '../datetime.utils';

/** A month grid for the day, time wheels under it. */
export const DateTimeCalendar = ({
  date,
  onChange,
  locale,
  minDate,
  maxDate,
  calendarProps,
  formatDay: _formatDay,
  visibleItems = CALENDAR_TIME_VISIBLE_ITEMS,
  style,
  theme,
  testID,
  ...timeProps
}: DateTimeViewProps) => (
  <View style={[styles.calendarLayout, style]} testID={testID}>
    <Calendar
      {...calendarProps}
      locale={locale}
      minDate={minDate}
      maxDate={maxDate}
      theme={theme}
      value={date}
      onChange={(day) => onChange(withDay(date, day, minDate, maxDate))}
      testID={testID ? `${testID}-calendar` : undefined}
    />
    <TimePicker
      {...timeProps}
      display={TIME_DISPLAY.wheel}
      {...getDayTimeBounds(date, minDate, maxDate)}
      locale={locale}
      visibleItems={visibleItems}
      theme={theme}
      value={date}
      onChange={onChange}
      testID={testID ? `${testID}-time` : undefined}
    />
  </View>
);
