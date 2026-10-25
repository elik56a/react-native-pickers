import { Calendar } from './Calendar';
import type { CalendarProps } from './Calendar';
import { DateWheelPicker } from './DateWheelPicker';
import type { DateWheelPickerProps } from './DateWheelPicker';

export type DatePickerProps =
  | ({ display?: 'calendar' } & CalendarProps)
  | ({ display: 'wheel' } & DateWheelPickerProps);

/**
 * Date picker.
 * - `display="calendar"` (default): month grid with single / range / multiple selection
 * - `display="wheel"`: day / month / year wheels
 */
export function DatePicker(props: DatePickerProps) {
  if (props.display === 'wheel') {
    const { display: _d, ...rest } = props;
    return <DateWheelPicker {...rest} />;
  }
  const { display: _d, ...rest } = props;
  return <Calendar {...(rest as CalendarProps)} />;
}
