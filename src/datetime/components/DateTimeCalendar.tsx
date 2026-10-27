import { View } from 'react-native';

import { Calendar } from '../../calendar/Calendar';
import { usePickerTheme } from '../../core';
import { TimePicker } from '../../time/TimePicker';
import { TIME_POSITION } from '../datetime.constants';
import { styles } from '../datetime.styles';
import type { DateTimeViewProps } from '../datetime.types';
import { getCalendarTimeRows, getDayTimeBounds, withDay } from '../datetime.utils';
import { useBesideFit } from '../hooks/useBesideFit';

/** A month grid for the day, and the time beside it (when both fit) or under it: wheels, a dial, Material's time input or the web's time panel. */
export const DateTimeCalendar = ({
  date,
  onChange,
  locale,
  minDate,
  maxDate,
  calendarProps,
  formatDay: _formatDay,
  visibleItems,
  timeDisplay,
  timePosition,
  style,
  theme,
  testID,
  ...timeProps
}: DateTimeViewProps) => {
  const t = usePickerTheme(theme);
  const { beside, onLayout, onTimeLayout } = useBesideFit(
    timePosition === TIME_POSITION.beside,
    [timeDisplay, timeProps.format, timeProps.showSeconds, locale].join()
  );
  return (
    <View
      onLayout={onLayout}
      style={[
        styles.calendarLayout,
        beside && [
          styles.besideLayout,
          {
            borderColor: t.colors.border,
            borderRadius: t.radius.lg,
            backgroundColor: t.colors.background,
          },
        ],
        style,
      ]}
      testID={testID}
    >
      <Calendar
        {...calendarProps}
        style={[beside && styles.besideCalendar, calendarProps?.style]}
        locale={locale}
        minDate={minDate}
        maxDate={maxDate}
        theme={theme}
        value={date}
        onChange={(day) => onChange(withDay(date, day, minDate, maxDate))}
        testID={testID ? `${testID}-calendar` : undefined}
      />
      <View onLayout={onTimeLayout}>
        <TimePicker
          {...timeProps}
          display={timeDisplay}
          {...getDayTimeBounds(date, minDate, maxDate)}
          locale={locale}
          visibleItems={visibleItems ?? getCalendarTimeRows(timeDisplay, beside ? TIME_POSITION.beside : TIME_POSITION.below)}
          theme={theme}
          value={date}
          onChange={onChange}
          style={beside && styles.besideTime}
          testID={testID ? `${testID}-time` : undefined}
        />
      </View>
    </View>
  );
};
