import { Calendar } from '../calendar/Calendar';
import { DateWheelPicker } from './DateWheelPicker';
import type { DatePickerProps } from './date.types';

/**
 * Date picker.
 * - `display="calendar"` (default): month grid with single / range / multiple selection
 * - `display="wheel"`: day / month / year wheels
 */
export const DatePicker = (props: DatePickerProps) => {
  if (props.display === 'wheel') {
    const { display: _display, ...wheelProps } = props;
    return <DateWheelPicker {...wheelProps} />;
  }
  const { display: _display, ...calendarProps } = props;
  return <Calendar {...calendarProps} />;
};
