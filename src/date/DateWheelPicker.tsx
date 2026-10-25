import { useMemo } from 'react';
import { useControllableState } from '../core/hooks/useControllableState';
import { clampDate } from '../core/utils/date.utils';
import { MultiWheelPicker } from '../wheel';
import type { DateWheelPickerProps } from './date.types';
import { buildWheelDate, getDateColumnSpecs, getLocaleDateOrder, getWheelYearBounds } from './date.utils';

export const DateWheelPicker = ({
  value,
  defaultValue,
  onChange,
  onValueChanging,
  locale,
  minDate,
  maxDate,
  order,
  monthFormat = 'long',
  yearRange,
  loop = true,
  itemHeight,
  visibleItems,
  variant,
  style,
  styles,
  theme,
  testID,
}: DateWheelPickerProps) => {
  const [date, commit] = useControllableState(value, () => clampDate(defaultValue ?? new Date(), minDate, maxDate), onChange);

  const columns = useMemo(() => {
    const specs = getDateColumnSpecs({
      date,
      locale,
      monthFormat,
      minDate,
      maxDate,
      years: getWheelYearBounds(new Date(), yearRange, minDate, maxDate),
      loop,
    });
    const dateWith = (part: keyof typeof specs, v: number) => buildWheelDate(date, { [part]: v }, minDate, maxDate);
    return (order ?? getLocaleDateOrder(locale)).map((part) => ({
      ...specs[part],
      testID: testID ? `${testID}-${part}` : undefined,
      onChange: (v: number) => commit(dateWith(part, v)),
      onValueChanging: onValueChanging ? (v: number) => onValueChanging(dateWith(part, v)) : undefined,
    }));
  }, [commit, date, locale, loop, maxDate, minDate, monthFormat, onValueChanging, order, testID, yearRange]);

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
