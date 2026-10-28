import { CLOSED_WEEKDAY, TIMER_PRESETS } from './showcase.constants';
import type { Duration, TextSelection } from './showcase.types';

const pad = (n: number) => String(n).padStart(2, '0');

/** A timer's length as a clock reads it: 4:00, or 2:15:00 once it runs an hour or more. */
export const formatDuration = ({ hours, minutes, seconds }: Duration) =>
  hours ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;

/** The preset a duration matches, if any. */
export const findPreset = (duration: Duration) => TIMER_PRESETS.find((p) => formatDuration(p.value) === formatDuration(duration));

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
