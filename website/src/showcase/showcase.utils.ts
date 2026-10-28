import { CLOSED_WEEKDAY, TIMER_PRESETS } from './showcase.constants';
import type { TextSelection } from './showcase.types';

const pad = (n: number) => String(n).padStart(2, '0');

/** A timer's length in seconds as a clock reads it: 4:00, or 2:15:00 once it runs an hour or more. */
export const formatClock = (total: number) => {
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return hours ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
};

/** The preset a duration in seconds matches, if any. */
export const findPreset = (seconds: number) => TIMER_PRESETS.find((p) => p.value === seconds);

export const isClosedDay = (date: Date) => date.getDay() === CLOSED_WEEKDAY;

/** `insert` typed over the selection, with the caret just after it, as an emoji keyboard does. */
export const insertAtSelection = (text: string, { start, end }: TextSelection, insert: string) => {
  const caret = start + insert.length;
  return {
    text: text.slice(0, start) + insert + text.slice(end),
    selection: {
      start: caret,
      end: caret,
    },
  };
};
