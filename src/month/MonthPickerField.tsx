import { formatMonthYear } from '../core/utils/date.utils';
import { PickerField } from '../sheet';
import { splitFieldProps } from '../sheet/sheet.utils';
import { MonthPickerSheet } from './MonthPickerSheet';
import type { MonthPickerFieldProps } from './month.types';

/** A field that opens a MonthPickerSheet and shows the confirmed month, like "October 2026". */
export const MonthPickerField = (props: MonthPickerFieldProps) => {
  const { field, sheet } = splitFieldProps(props);
  return (
    <PickerField {...field} displayValue={field.displayValue ?? (props.value ? formatMonthYear(props.value, props.locale) : '')}>
      {(state) => <MonthPickerSheet title={field.label} {...sheet} {...state} />}
    </PickerField>
  );
};
