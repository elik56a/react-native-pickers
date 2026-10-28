import { useControllableState } from '../core/hooks/useControllableState';
import { useDesignOverride, usePickerTheme } from '../core/theme/ThemeProvider';
import { clampDate, startOfMonth } from '../core/utils/date.utils';
import { DateWheelPicker } from '../date/DateWheelPicker';
import { MonthGrid } from './components/MonthGrid';
import { MONTH_DISPLAY, MONTH_DISPLAY_DESIGN } from './month.constants';
import type { MonthPickerProps } from './month.types';
import { getMonthOrder } from './month.utils';

/** A month and year, such as a card's expiry or a report's month: wheels, or a grid of months. The value is its first day. */
export const MonthPicker = ({
  value,
  defaultValue,
  onChange,
  display: displayProp,
  locale,
  minDate,
  maxDate,
  yearRange,
  monthFormat,
  loop,
  itemHeight,
  visibleItems,
  variant,
  style,
  styles,
  theme: themeProp,
  design,
  testID,
}: MonthPickerProps) => {
  const theme = useDesignOverride(themeProp, design);
  const resolved = usePickerTheme(theme);
  const [month, setMonth] = useControllableState(
    value,
    () => startOfMonth(clampDate(defaultValue ?? new Date(), minDate, maxDate)),
    onChange
  );
  const display = displayProp ?? MONTH_DISPLAY_DESIGN[resolved.design];

  if (display === MONTH_DISPLAY.grid) {
    return (
      <MonthGrid
        value={month}
        onChange={setMonth}
        locale={locale}
        minDate={minDate}
        maxDate={maxDate}
        yearRange={yearRange}
        theme={resolved}
        style={style}
        styles={styles}
        testID={testID}
      />
    );
  }
  return (
    <DateWheelPicker
      value={startOfMonth(month)}
      onChange={(date) => setMonth(startOfMonth(date))}
      order={getMonthOrder(locale)}
      locale={locale}
      minDate={minDate}
      maxDate={maxDate}
      yearRange={yearRange}
      monthFormat={monthFormat}
      loop={loop}
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
