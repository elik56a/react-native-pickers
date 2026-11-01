import type { BottomSheetProps } from '@elik56a/react-native-pickers';
import { SelectPicker } from '@elik56a/react-native-pickers';
import { BOOKING_FIELD, SELECT_LIST_HEIGHT } from '../demo.constants';
import type { Booking } from '../hooks/useBooking';

interface WhereFieldProps {
  booking: Booking;
  sheetProps: Partial<BottomSheetProps>;
}

/** One city from a searchable list grouped by region. */
export const WhereField = ({ booking, sheetProps }: WhereFieldProps) => (
  <SelectPicker
    label={BOOKING_FIELD.where}
    options={booking.cityOptions}
    value={booking.city}
    onChange={booking.setCity}
    searchable
    listHeight={SELECT_LIST_HEIGHT}
    sheet={{ sheetProps }}
  />
);
