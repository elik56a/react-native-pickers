import { PickerField } from '../sheet';
import { splitFieldProps } from '../sheet/sheet.utils';
import { DurationPickerSheet } from './DurationPickerSheet';
import type { DurationPickerFieldProps } from './duration.types';
import { formatDuration } from './duration.utils';

/** A field that opens a DurationPickerSheet and shows the confirmed duration, like "1 h 30 min". */
export const DurationPickerField = (props: DurationPickerFieldProps) => {
  const { field, sheet } = splitFieldProps(props);
  return (
    <PickerField {...field} displayValue={field.displayValue ?? (props.value !== undefined ? formatDuration(props.value, props) : '')}>
      {(state) => <DurationPickerSheet title={field.label} {...sheet} {...state} />}
    </PickerField>
  );
};
