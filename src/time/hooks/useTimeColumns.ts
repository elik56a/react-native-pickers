import { useCallback, useMemo } from 'react';

import { getDayPeriods } from '../../core/utils/date.utils';
import { DEFAULT_TIME_SEPARATOR } from '../time.constants';
import type { TimeColumnsOptions } from '../time.types';
import {
  buildTime,
  clampTimeOfDay,
  getTimeBounds,
  getTimeColumnSpecs,
  getTimeParts,
  getTimeSeparator,
  is12HourFormat,
} from '../time.utils';

/** The hour / minute / second / AM-PM wheel columns for `date`, and the separator between them. */
export const useTimeColumns = ({
  date,
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
  testID,
}: TimeColumnsOptions) => {
  const is12 = is12HourFormat(format, locale);
  const periods = useMemo(() => dayPeriodLabels ?? getDayPeriods(locale), [dayPeriodLabels, locale]);
  const [minSecond, maxSecond] = getTimeBounds(minTime, maxTime);

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
        onChange: (v: number) => onChange(clampTimeOfDay(timeFor(v), [minSecond, maxSecond], showSeconds)),
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
    onChange,
    onValueChanging,
    padHours,
    periods,
    secondInterval,
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

  return {
    columns,
    separator: columnSeparator,
  };
};
