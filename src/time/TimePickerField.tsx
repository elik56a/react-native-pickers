import { PickerField } from '../sheet';
import { splitFieldProps } from '../sheet/sheet.utils';
import { TimePickerSheet } from './TimePickerSheet';
import type { TimePickerFieldProps } from './time.types';
import { formatTimeValue } from './time.utils';

/** A field that opens a TimePickerSheet and shows the confirmed time. */
export const TimePickerField = (props: TimePickerFieldProps) => {
  const { field, sheet } = splitFieldProps(props);
  return (
    <PickerField {...field} displayValue={field.displayValue ?? (props.value ? formatTimeValue(props.value, props) : '')}>
      {(state) => <TimePickerSheet title={field.label} {...sheet} {...state} />}
    </PickerField>
  );
};
