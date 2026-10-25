import { useCallback, useMemo } from 'react';
import { useControllableState } from '../core/hooks/useControllableState';
import { getDayPeriods } from '../core/utils/date.utils';
import { MultiWheelPicker } from '../wheel';
import { DEFAULT_TIME_SEPARATOR } from './time.constants';
import type { TimePickerProps } from './time.types';
import { buildTime, clampTimeOfDay, getTimeBounds, getTimeColumnSpecs, getTimeParts, getTimeSeparator, is12HourFormat } from './time.utils';

export const TimePicker = ({
  value,
  defaultValue,
  onChange,
  onValueChanging,
  format = 'auto',
  locale,
  minuteInterval = 1,
  showSeconds = false,
  secondInterval = 1,
  minTime,
  maxTime,
  loop = true,
  padHours,
  dayPeriodLabels,
  dayPeriodFirst = false,
  separator = DEFAULT_TIME_SEPARATOR,
  itemHeight,
  visibleItems,
  variant,
  style,
  styles,
  theme,
  testID,
}: TimePickerProps) => {
  const [date, setDate] = useControllableState(value, () => defaultValue ?? new Date(), onChange);
  const is12 = is12HourFormat(format, locale);
  const periods = useMemo(() => dayPeriodLabels ?? getDayPeriods(locale), [dayPeriodLabels, locale]);
  const bounds = getTimeBounds(minTime, maxTime);
  const [minSecond, maxSecond] = bounds;

  const columns = useMemo(() => {
    const parts = getTimeParts(date, minuteInterval, secondInterval);
    const specs = getTimeColumnSpecs({
      parts,
      is12,
      padHours: padHours ?? !is12,
      periods,
      dayPeriodFirst,
      minuteInterval,
      showSeconds,
      secondInterval,
      bounds: [minSecond, maxSecond],
      loop,
    });
    return specs.map(({ toPatch, ...column }) => {
      const timeFor = (v: number) => buildTime(date, parts, toPatch(v), showSeconds);
      return {
        ...column,
        testID: testID ? `${testID}-${column.key}` : undefined,
        onChange: (v: number) => setDate(clampTimeOfDay(timeFor(v), [minSecond, maxSecond], showSeconds)),
        onValueChanging: onValueChanging ? (v: number) => onValueChanging(timeFor(v)) : undefined,
      };
    });
  }, [
    date,
    dayPeriodFirst,
    is12,
    loop,
    maxSecond,
    minSecond,
    minuteInterval,
    onValueChanging,
    padHours,
    periods,
    secondInterval,
    setDate,
    showSeconds,
    testID,
  ]);

  const columnSeparator = useCallback(
    (leftIndex: number) =>
      getTimeSeparator(
        columns.map((column) => column.key),
        leftIndex,
        separator
      ),
    [columns, separator]
  );

  return (
    <MultiWheelPicker
      columns={columns}
      separator={columnSeparator}
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
