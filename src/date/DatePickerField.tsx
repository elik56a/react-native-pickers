import { PickerField } from '../sheet';
import { splitFieldProps } from '../sheet/sheet.utils';
import { DatePickerSheet } from './DatePickerSheet';
import type { DatePickerFieldProps } from './date.types';
import { formatDateValue } from './date.utils';

/** A field that opens a DatePickerSheet and shows the confirmed date, range or dates. */
export const DatePickerField = (props: DatePickerFieldProps) => {
  const { field, sheet } = splitFieldProps(props);
  return (
    <PickerField {...field} displayValue={field.displayValue ?? formatDateValue(props.value, props.locale)}>
      {(state) => <DatePickerSheet title={field.label} {...sheet} {...state} />}
    </PickerField>
  );
};
