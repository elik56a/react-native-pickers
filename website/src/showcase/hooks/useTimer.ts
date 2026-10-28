import { useState } from 'react';

import { TIMER_PRESETS } from '../showcase.constants';
import { findPreset, formatClock } from '../showcase.utils';

/** A timer's length in seconds, with presets that set it. */
export const useTimer = () => {
  const [seconds, setSeconds] = useState(TIMER_PRESETS[0].value);
  const preset = findPreset(seconds);
  return {
    seconds,
    setSeconds,
    label: `${preset?.label ?? 'Custom'} · ${formatClock(seconds)}`,
    preset: preset?.label ?? null,
    choosePreset: (label: string) => setSeconds(TIMER_PRESETS.find((p) => p.label === label)?.value ?? seconds),
  };
};
