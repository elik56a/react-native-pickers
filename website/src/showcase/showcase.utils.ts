import { ALBUM_SORT, CLOSED_WEEKDAY, HOURS_IN_DAY, MIN_PREVIEW_OPACITY, TEXT_SIZES, TIMER_PRESETS } from './showcase.constants';
import type { Album, AlbumSort, TextSelection } from './showcase.types';

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

/** An hour of the day on a 12-hour clock: 0 → 12 AM, 13 → 1 PM, 24 → 12 AM. */
export const formatHour = (hour: number) => {
  const h = hour % HOURS_IN_DAY;
  return `${h % 12 || 12} ${h < 12 ? 'AM' : 'PM'}`;
};

/** How bright the preview shows for a 0–100 brightness. */
export const previewOpacity = (brightness: number) => MIN_PREVIEW_OPACITY + ((1 - MIN_PREVIEW_OPACITY) * brightness) / 100;

/** A text size's name on its mark, such as M for 17 pt. */
export const textSizeLabel = (size: number) => TEXT_SIZES.find((option) => option.value === size)?.label ?? `${size} pt`;

/** Albums in the chosen order; `recent` keeps the list's own order, newest first. */
export const sortAlbums = (albums: Album[], sort: AlbumSort) => {
  if (sort === ALBUM_SORT.name) return [...albums].sort((a, b) => a.name.localeCompare(b.name));
  if (sort === ALBUM_SORT.photos) return [...albums].sort((a, b) => b.photos - a.photos);
  return albums;
};
