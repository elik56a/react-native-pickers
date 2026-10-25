import { useControllableState } from '../core/hooks/useControllableState';
import { clampDate } from '../core/utils/date.utils';
import { DateTimeCalendar } from './components/DateTimeCalendar';
import { DateTimeWheels } from './components/DateTimeWheels';
import type { DateTimePickerProps } from './datetime.types';

/**
 * Date and time picker.
 * - `display="wheel"` (default): day, hour, minute (and AM/PM) wheels in one row
 * - `display="calendar"`: month grid with time wheels under it
 */
export const DateTimePicker = ({ value, defaultValue, onChange, display = 'wheel', ...rest }: DateTimePickerProps) => {
  const [date, setDate] = useControllableState(value, () => clampDate(defaultValue ?? new Date(), rest.minDate, rest.maxDate), onChange);
  const Display = display === 'calendar' ? DateTimeCalendar : DateTimeWheels;
  return <Display {...rest} date={date} onChange={setDate} />;
};
