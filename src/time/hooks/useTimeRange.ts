import { useState } from 'react';

import { useControllableState } from '../../core/hooks/useControllableState';
import { TIME_RANGE_END } from '../time.constants';
import type { TimeRangeEnd, TimeRangePickerProps } from '../time.types';
import { fitTimeRange, getDefaultTimeRange } from '../time.utils';

/** The range, which end the picker is editing, and moving that end within the rules. */
export const useTimeRange = ({ value, defaultValue, onChange, minDuration, maxDuration, allowOvernight }: TimeRangePickerProps) => {
  const rules = {
    minDuration,
    maxDuration,
    allowOvernight,
  };
  const [range, setRange] = useControllableState(value, () => defaultValue ?? getDefaultTimeRange(new Date(), rules), onChange);
  const [active, setActive] = useState<TimeRangeEnd>(TIME_RANGE_END.start);
  const move = (end: TimeRangeEnd, time: Date) => setRange(fitTimeRange(range, end, time, rules));
  return {
    range,
    active,
    setActive,
    move,
  };
};
