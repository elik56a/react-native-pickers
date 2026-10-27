import { useControllableState } from '../core/hooks/useControllableState';
import { useDesignOverride, usePickerTheme } from '../core/theme/ThemeProvider';
import { MultiWheelPicker } from '../wheel';
import { TimeList } from './components/TimeList';
import { useTimeColumns } from './hooks/useTimeColumns';
import { TIME_DISPLAY, TIME_DISPLAY_DESIGN } from './time.constants';
import type { TimePickerProps } from './time.types';

export const TimePicker = ({
  value,
  defaultValue,
  onChange,
  display: displayProp,
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
  const resolved = usePickerTheme(theme);
  const [date, setDate] = useControllableState(value, () => defaultValue ?? new Date(), onChange);
  const { columns, separator } = useTimeColumns({ ...options, date, onChange: setDate, testID });
  const display = displayProp ?? TIME_DISPLAY_DESIGN[resolved.design];

  if (display === TIME_DISPLAY.list) {
    return (
      <TimeList
        date={date}
        onChange={setDate}
        options={options}
        visibleRows={visibleItems}
        theme={resolved}
        style={style}
        testID={testID}
      />
    );
  }
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
