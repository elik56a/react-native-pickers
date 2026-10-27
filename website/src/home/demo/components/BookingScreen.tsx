import { Text, View } from 'react-native';

import { DatePickerField, SelectPicker, TimePickerField, usePickerTheme } from '@elik56a/react-native-pickers';
import { PLATFORM } from '../../device/device.constants';
import type { Platform } from '../../device/device.types';
import { BOOKING_FIELD, CHECK_IN_INTERVAL, SELECT_LIST_HEIGHT } from '../demo.constants';
import { styles } from '../demo.styles';
import { deviceSheetProps, startOfToday } from '../demo.utils';
import { useBooking } from '../hooks/useBooking';
import { GuestsField } from './GuestsField';
import { ReserveButton } from './ReserveButton';

const DAY_HEIGHT = 46;

/** A booking form whose every field opens one of the pickers: a searchable select, a priced range calendar, the time, two wheels. */
export const BookingScreen = ({ platform, screenHeight }: { platform: Platform; screenHeight?: number }) => {
  const { colors } = usePickerTheme();
  const booking = useBooking();
  const sheetProps = deviceSheetProps(platform, screenHeight);
  return (
    <View style={[styles.root, platform === PLATFORM.web && styles.browserRoot, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Book a stay</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{booking.summary}</Text>
      </View>
      <View style={styles.booking}>
        <SelectPicker
          label={BOOKING_FIELD.where}
          options={booking.cities}
          value={booking.city}
          onChange={booking.setCity}
          searchable
          listHeight={SELECT_LIST_HEIGHT}
          sheet={{ sheetProps }}
        />
        <DatePickerField
          label={BOOKING_FIELD.dates}
          mode="range"
          value={booking.range}
          onConfirm={booking.setRange}
          minDate={startOfToday()}
          markedDates={booking.prices}
          dayHeight={DAY_HEIGHT}
          sheetProps={sheetProps}
        />
        <TimePickerField
          label={BOOKING_FIELD.checkIn}
          value={booking.checkIn}
          onConfirm={booking.setCheckIn}
          minuteInterval={CHECK_IN_INTERVAL}
          sheetProps={sheetProps}
        />
        <GuestsField value={booking.guests} onConfirm={booking.setGuests} sheetProps={sheetProps} />
      </View>
      <ReserveButton total={booking.total} disabled={!booking.nights} />
    </View>
  );
};
