import { useCallback, useMemo } from 'react';

import { startOfDay } from '../../core/utils/date.utils';
import { useTimeColumns } from '../../time/hooks/useTimeColumns';
import { MultiWheelPicker } from '../../wheel';
import { DAY_COLUMN_FLEX } from '../datetime.constants';
import type { DateTimeViewProps } from '../datetime.types';
import { formatDayLabel, getDayItems, getDayTimeBounds, getDayWheelBounds, withDay } from '../datetime.utils';

/** iOS-style: one day wheel next to the time wheels, under a single selection band. */
export const DateTimeWheels = ({
  date,
  onChange,
  onValueChanging,
  locale,
  minDate,
  maxDate,
  formatDay = formatDayLabel,
  calendarProps: _calendarProps,
  itemHeight,
  visibleItems,
  variant,
  style,
  styles,
  theme,
  testID,
  ...timeOptions
}: DateTimeViewProps) => {
  const time = useTimeColumns({
    ...timeOptions,
    ...getDayTimeBounds(date, minDate, maxDate),
    date,
    onChange,
    onValueChanging,
    locale,
    testID,
  });
  const [first, last] = getDayWheelBounds(date, minDate, maxDate);
  const days = useMemo(() => getDayItems([first, last], formatDay, locale), [first, last, formatDay, locale]);

  const dayColumn = useMemo(() => {
    const dateOn = (day: number) => withDay(date, new Date(day), minDate, maxDate);
    return {
      key: 'day',
      items: days,
      value: startOfDay(date).getTime(),
      flex: DAY_COLUMN_FLEX,
      testID: testID ? `${testID}-day` : undefined,
      onChange: (day: number) => onChange(dateOn(day)),
      onValueChanging: onValueChanging ? (day: number) => onValueChanging(dateOn(day)) : undefined,
    };
  }, [date, days, maxDate, minDate, onChange, onValueChanging, testID]);

  const separator = useCallback((leftIndex: number) => (leftIndex === 0 ? null : time.separator(leftIndex - 1)), [time.separator]);

  return (
    <MultiWheelPicker
      columns={[dayColumn, ...time.columns]}
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
