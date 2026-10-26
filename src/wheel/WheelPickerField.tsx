import { PickerField } from '../sheet';
import { splitFieldProps } from '../sheet/sheet.utils';
import { WheelPickerSheet } from './WheelPickerSheet';
import type { WheelPickerFieldProps } from './wheel.types';
import { getItemLabel } from './wheel.utils';

/** A field that opens a WheelPickerSheet and shows the confirmed item's label. */
export const WheelPickerField = <T,>(props: WheelPickerFieldProps<T>) => {
  const { field, sheet } = splitFieldProps(props);
  return (
    <PickerField {...field} displayValue={field.displayValue ?? getItemLabel(props.items, props.value, props.isEqual)}>
      {(state) => <WheelPickerSheet<T> title={field.label} {...sheet} {...state} />}
    </PickerField>
  );
};
