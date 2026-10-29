import type { Design } from '../core/theme/theme.types';
import { TIME_DISPLAY } from '../time/time.constants';
import type { DurationDisplay, DurationLabels, DurationUnit } from './duration.types';

export const DURATION_UNIT = {
  hours: 'hours',
  minutes: 'minutes',
  seconds: 'seconds',
} as const;

export const DURATION_UNITS: DurationUnit[] = [DURATION_UNIT.hours, DURATION_UNIT.minutes, DURATION_UNIT.seconds];

/** The narrowest a typed box gets on a small screen: two digits still fit. */
export const DURATION_FIELD_MIN_WIDTH = 56;

export const DEFAULT_DURATION_LABELS: DurationLabels = {
  hours: 'h',
  minutes: 'min',
  seconds: 's',
};

/** Read by screen readers before a wheel's value, as in "Minutes, 30". */
export const DURATION_COLUMN_LABEL: DurationLabels = {
  hours: 'Hours',
  minutes: 'Minutes',
  seconds: 'Seconds',
};

/** iOS scrolls wheels like its countdown timer, Material types the numbers like its time input, and the web clicks from columns. */
export const DURATION_DISPLAY_DESIGN: Record<Design, DurationDisplay> = {
  ios: TIME_DISPLAY.wheel,
  material: TIME_DISPLAY.input,
  web: TIME_DISPLAY.list,
};
