import type { BottomSheetProps } from '@elik56a/react-native-pickers';
import { SelectPicker } from '@elik56a/react-native-pickers';
import type { TabOptions } from '../../playground/playground.types';
import { BOOKING_FIELD, MAX_CITIES, SELECT_LIST_HEIGHT } from '../demo.constants';
import type { Booking } from '../hooks/useBooking';

interface WhereFieldProps {
  booking: Booking;
  options: TabOptions<'select'>;
  sheetProps: Partial<BottomSheetProps>;
}

/** One city, or a few with `multiple`, from a searchable list grouped by region. */
export const WhereField = ({ booking, options, sheetProps }: WhereFieldProps) => {
  const shared = {
    label: BOOKING_FIELD.where,
    options: booking.cityOptions,
    searchable: options.searchable,
    loading: options.loading,
    listHeight: SELECT_LIST_HEIGHT,
    sheet: { sheetProps },
  };
  return options.multiple ? (
    <SelectPicker {...shared} multiple value={booking.cities} onChange={booking.setCities} maxSelected={MAX_CITIES} />
  ) : (
    <SelectPicker {...shared} value={booking.city} onChange={booking.setCity} />
  );
};
