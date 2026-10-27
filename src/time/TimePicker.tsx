import { useControllableState } from '../core/hooks/useControllableState';
import { useDesignOverride } from '../core/theme/ThemeProvider';
import { MultiWheelPicker } from '../wheel';
import { useTimeColumns } from './hooks/useTimeColumns';
import type { TimePickerProps } from './time.types';

export const TimePicker = ({
  value,
  defaultValue,
  onChange,
  itemHeight,
  visibleItems,
  variant,
  style,
  styles,
  theme: themeProp,
  design,
  testID,
  ...options
}: TimePickerProps) => {
  const theme = useDesignOverride(themeProp, design);
  const [date, setDate] = useControllableState(value, () => defaultValue ?? new Date(), onChange);
  const { columns, separator } = useTimeColumns({ ...options, date, onChange: setDate, testID });

  return (
    <MultiWheelPicker
      columns={columns}
      separator={separator}
      itemHeight={itemHeight}
      visibleItems={visibleItems}
      variant={variant}
      style={style}
      styles={styles}
      theme={theme}
      testID={testID}
    />
  );
};
