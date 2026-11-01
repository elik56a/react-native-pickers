import type { BottomSheetProps } from '@elik56a/react-native-pickers';
import { DatePickerField } from '@elik56a/react-native-pickers';
import { BOOKING_FIELD, DAY_HEIGHT } from '../demo.constants';
import { startOfToday } from '../demo.utils';
import type { Booking } from '../hooks/useBooking';

interface DatesFieldProps {
  booking: Booking;
  sheetProps: Partial<BottomSheetProps>;
}

/** The stay's check-in and check-out on a priced calendar. */
export const DatesField = ({ booking, sheetProps }: DatesFieldProps) => (
  <DatePickerField
    label={BOOKING_FIELD.dates}
    mode="range"
    value={booking.range}
    onConfirm={booking.setRange}
    minDate={startOfToday()}
    dayHeight={DAY_HEIGHT}
    markedDates={booking.prices}
    firstDayOfWeek={0}
    sheetProps={sheetProps}
  />
);
