import { useControllableState } from '../core/hooks/useControllableState';
import { useDesignOverride, usePickerTheme } from '../core/theme/ThemeProvider';
import { MultiWheelPicker } from '../wheel';
import { ClockDial } from './components/ClockDial';
import { TimePanel } from './components/TimePanel';
import { useTimeColumns } from './hooks/useTimeColumns';
import { TIME_DISPLAY } from './time.constants';
import type { TimePickerProps } from './time.types';
import { resolveTimeDisplay } from './time.utils';

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
  const display = resolveTimeDisplay(displayProp, resolved.design, !!options.showSeconds);

  if (display === TIME_DISPLAY.dial || display === TIME_DISPLAY.input) {
    return (
      <ClockDial
        inputOnly={display === TIME_DISPLAY.input}
        date={date}
        onChange={setDate}
        options={options}
        theme={resolved}
        style={style}
        testID={testID}
      />
    );
  }
  if (display === TIME_DISPLAY.list) {
    return <TimePanel columns={columns} visibleRows={visibleItems} theme={resolved} style={style} testID={testID} />;
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
