import { PICKER_DISPLAY } from '../core/core.constants';
import { useControllableState } from '../core/hooks/useControllableState';
import { useDesignOverride, usePickerTheme } from '../core/theme/ThemeProvider';
import { clampDate } from '../core/utils/date.utils';
import { DateTimeCalendar } from './components/DateTimeCalendar';
import { DateTimeWheels } from './components/DateTimeWheels';
import { DATETIME_DESIGN } from './datetime.constants';
import type { DateTimePickerProps } from './datetime.types';

/**
 * Date and time picker.
 * - `display="wheel"` (the iOS default): day, hour, minute (and AM/PM) wheels in one row
 * - `display="calendar"` (the Material and web default): month grid with the time under it (Material) or beside it (web), as the design shows time
 */
export const DateTimePicker = ({
  value,
  defaultValue,
  onChange,
  display: displayProp,
  timePosition,
  timeDisplay,
  theme,
  design,
  ...rest
}: DateTimePickerProps) => {
  const themeOverride = useDesignOverride(theme, design);
  const look = DATETIME_DESIGN[usePickerTheme(themeOverride).design];
  const display = displayProp ?? look.display;
  const [date, setDate] = useControllableState(value, () => clampDate(defaultValue ?? new Date(), rest.minDate, rest.maxDate), onChange);
  const Display = display === PICKER_DISPLAY.calendar ? DateTimeCalendar : DateTimeWheels;
  return (
    <Display
      {...rest}
      theme={themeOverride}
      timeDisplay={timeDisplay ?? look.timeDisplay}
      timePosition={timePosition ?? look.timePosition}
      date={date}
      onChange={setDate}
    />
  );
};
