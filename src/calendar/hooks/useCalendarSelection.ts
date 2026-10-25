import { useCallback, useMemo } from 'react';
import { useControllableState } from '../../core/hooks/useControllableState';
import { EMPTY_RANGE } from '../calendar.constants';
import type { CalendarSelection, CalendarSelectionProps, DateRange } from '../calendar.types';
import { nextRange, toggleMultiple } from '../calendar.utils';

const NO_DATES: Date[] = [];

/** Selection state for whichever mode the props describe, controlled or not. */
export const useCalendarSelection = (props: CalendarSelectionProps, isDisabled: (day: Date) => boolean) => {
  const single = props.mode === 'range' || props.mode === 'multiple' ? undefined : props;
  const range = props.mode === 'range' ? props : undefined;
  const multiple = props.mode === 'multiple' ? props : undefined;
  const mode = props.mode ?? 'single';

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

  const selection = useMemo<CalendarSelection>(
    () => ({
      mode,
      single: mode === 'single' ? singleValue : null,
      range: mode === 'range' ? rangeValue : EMPTY_RANGE,
      multiple: mode === 'multiple' ? multipleValue : NO_DATES,
    }),
    [mode, multipleValue, rangeValue, singleValue]
  );

  const select = useCallback(
    (day: Date) => {
      if (range) {
        const next = nextRange(rangeValue, day, range, isDisabled);
        if (next) setRange(next);
      } else if (multiple) {
        const next = toggleMultiple(multipleValue, day, multiple.maxSelections);
        if (next) setMultiple(next);
      } else {
        setSingle(day);
      }
    },
    [isDisabled, multiple, multipleValue, range, rangeValue, setMultiple, setRange, setSingle]
  );

  return {
    selection,
    select,
  };
};
