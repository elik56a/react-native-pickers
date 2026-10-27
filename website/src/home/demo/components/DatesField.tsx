import type { BottomSheetProps } from '@elik56a/react-native-pickers';
import { DatePickerField } from '@elik56a/react-native-pickers';
import type { TabOptions } from '../../playground/playground.types';
import { BOOKING_FIELD } from '../demo.constants';
import { startOfToday } from '../demo.utils';
import type { Booking } from '../hooks/useBooking';

const DAY_HEIGHT = 46;

interface DatesFieldProps {
  booking: Booking;
  options: TabOptions<'date'>;
  sheetProps: Partial<BottomSheetProps>;
}

/** The stay's dates, in whichever calendar mode the props panel picked; each mode keeps its own pick. */
export const DatesField = ({ booking, options, sheetProps }: DatesFieldProps) => {
  const common = {
    label: BOOKING_FIELD.dates,
    minDate: startOfToday(),
    dayHeight: DAY_HEIGHT,
    markedDates: options.prices ? booking.prices : undefined,
    firstDayOfWeek: options.firstDayOfWeek,
    sheetProps,
  };
  if (options.mode === 'single') return <DatePickerField {...common} value={booking.date} onConfirm={booking.setDate} />;
  if (options.mode === 'multiple')
    return <DatePickerField {...common} mode="multiple" value={booking.dates} onConfirm={booking.setDates} />;
  if (options.mode === 'ranges') return <DatePickerField {...common} mode="ranges" value={booking.ranges} onConfirm={booking.setRanges} />;
  return <DatePickerField {...common} mode="range" value={booking.range} onConfirm={booking.setRange} />;
};
