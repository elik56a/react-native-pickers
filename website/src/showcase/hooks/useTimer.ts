import { useState } from 'react';

import { TIMER_COLUMNS, TIMER_PRESETS } from '../showcase.constants';
import type { Duration } from '../showcase.types';
import { findPreset, formatDuration } from '../showcase.utils';

/** A timer's length on three wheels, with presets that set all three. */
export const useTimer = () => {
  const [duration, setDuration] = useState<Duration>(TIMER_PRESETS[0].value);
  const preset = findPreset(duration);
  return {
    label: `${preset?.label ?? 'Custom'} · ${formatDuration(duration)}`,
    preset: preset?.label ?? null,
    choosePreset: (label: string) => setDuration(TIMER_PRESETS.find((p) => p.label === label)?.value ?? duration),
    columns: TIMER_COLUMNS.map((column) => ({
      ...column,
      value: duration[column.key],
      onChange: (value: number) =>
        setDuration((d) => ({
          ...d,
          [column.key]: value,
        })),
    })),
  };
};
