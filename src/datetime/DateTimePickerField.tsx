import { PickerField } from '../sheet';
import { splitFieldProps } from '../sheet/sheet.utils';
import { DateTimePickerSheet } from './DateTimePickerSheet';
import type { DateTimePickerFieldProps } from './datetime.types';
import { formatDateTimeValue } from './datetime.utils';

/** A field that opens a DateTimePickerSheet and shows the confirmed date and time. */
export const DateTimePickerField = (props: DateTimePickerFieldProps) => {
  const { field, sheet } = splitFieldProps(props);
  return (
    <PickerField {...field} displayValue={field.displayValue ?? (props.value ? formatDateTimeValue(props.value, props) : '')}>
      {(state) => <DateTimePickerSheet title={field.label} {...sheet} {...state} />}
    </PickerField>
  );
};
