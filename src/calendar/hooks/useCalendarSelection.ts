import { useCallback, useMemo } from 'react';

import { useControllableState } from '../../core/hooks/useControllableState';
import { CALENDAR_MODE, EMPTY_RANGE } from '../calendar.constants';
import type { CalendarSelection, CalendarSelectionProps, DateRange } from '../calendar.types';
import { nextRange, nextRanges, toggleMultiple } from '../calendar.utils';

const NO_DATES: Date[] = [];
const NO_RANGES: DateRange[] = [];

/** Selection state for whichever mode the props describe, controlled or not. */
export const useCalendarSelection = (props: CalendarSelectionProps, isDisabled: (day: Date) => boolean) => {
  const single = props.mode === undefined || props.mode === CALENDAR_MODE.single ? props : undefined;
  const range = props.mode === CALENDAR_MODE.range ? props : undefined;
  const multiple = props.mode === CALENDAR_MODE.multiple ? props : undefined;
  const ranges = props.mode === CALENDAR_MODE.ranges ? props : undefined;
  const mode = props.mode ?? CALENDAR_MODE.single;

  const onSingleChange = single?.onChange;
  const [singleValue, setSingle] = useControllableState<Date | null>(single?.value, single?.defaultValue ?? null, (day) => {
    if (day) onSingleChange?.(day);
  });
  const [rangeValue, setRange] = useControllableState<DateRange>(range?.value, range?.defaultValue ?? EMPTY_RANGE, range?.onChange);
  const [multipleValue, setMultiple] = useControllableState<Date[]>(
    multiple?.value,
    multiple?.defaultValue ?? NO_DATES,
    multiple?.onChange
  );
  const [rangesValue, setRanges] = useControllableState<DateRange[]>(ranges?.value, ranges?.defaultValue ?? NO_RANGES, ranges?.onChange);

  const selection = useMemo<CalendarSelection>(
    () => ({
      mode,
      single: mode === CALENDAR_MODE.single ? singleValue : null,
      range: mode === CALENDAR_MODE.range ? rangeValue : EMPTY_RANGE,
      multiple: mode === CALENDAR_MODE.multiple ? multipleValue : NO_DATES,
      ranges: mode === CALENDAR_MODE.ranges ? rangesValue : NO_RANGES,
    }),
    [mode, multipleValue, rangeValue, rangesValue, singleValue]
  );

  const select = useCallback(
    (day: Date) => {
      if (range) {
        const next = nextRange(rangeValue, day, range, isDisabled);
        if (next) setRange(next);
      } else if (multiple) {
        const next = toggleMultiple(multipleValue, day, multiple.maxSelections);
        if (next) setMultiple(next);
      } else if (ranges) {
        const next = nextRanges(rangesValue, day, ranges, isDisabled);
        if (next) setRanges(next);
      } else {
        setSingle(day);
      }
    },
    [isDisabled, multiple, multipleValue, range, rangeValue, ranges, rangesValue, setMultiple, setRange, setRanges, setSingle]
  );

  return {
    selection,
    select,
  };
};
