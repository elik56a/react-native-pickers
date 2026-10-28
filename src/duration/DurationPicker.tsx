import { useControllableState } from '../core/hooks/useControllableState';
import { useDesignOverride, usePickerTheme } from '../core/theme/ThemeProvider';
import { TimePanel } from '../time/components/TimePanel';
import { TIME_DISPLAY } from '../time/time.constants';
import { MultiWheelPicker } from '../wheel';
import { DurationInput } from './components/DurationInput';
import { DURATION_DISPLAY_DESIGN } from './duration.constants';
import type { DurationPickerProps } from './duration.types';
import { useDurationColumns } from './hooks/useDurationColumns';

/** A length of time (hours, minutes and seconds), with the value in seconds: wheels, boxes to type into, or columns to click. */
export const DurationPicker = ({
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
}: DurationPickerProps) => {
  const theme = useDesignOverride(themeProp, design);
  const resolved = usePickerTheme(theme);
  const [seconds, setSeconds] = useControllableState(value, defaultValue ?? 0, onChange);
  const columns = useDurationColumns({ ...options, value: seconds, onChange: setSeconds, testID });
  const display = displayProp ?? DURATION_DISPLAY_DESIGN[resolved.design];

  if (display === TIME_DISPLAY.input) {
    return <DurationInput columns={columns} theme={resolved} style={style} testID={testID} />;
  }
  if (display === TIME_DISPLAY.list) {
    return <TimePanel columns={columns} visibleRows={visibleItems} theme={resolved} style={style} testID={testID} />;
  }
  return (
    <MultiWheelPicker
      columns={columns}
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
