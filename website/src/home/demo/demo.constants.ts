import type { DemoTab, TabOptions } from '../playground/playground.types';

export const TAB_FADE_MS = 280;
export const DAY_MS = 864e5;
export const SEGMENTED_PADDING = 4;
/** Keeps an expanded sheet below the mock status bar. */
export const PHONE_STATUS_BAR = 52;
export const PRICE_DAYS = 120;
export const WEEKDAY_PRICE = 89;
export const WEEKEND_PRICE = 149;
export const SELECT_LIST_HEIGHT = 240;
export const MAX_CITIES = 4;
export const DEFAULT_EMOJI = '🎉';
export const DEFAULT_SIZE = 'M';

export const TITLES: Record<DemoTab, string> = {
  date: 'Book your stay',
  time: 'Wake me at',
  wheel: 'Pick a size',
  select: 'Plan a trip',
  emoji: 'React',
};

export const DATE_SUBTITLES: Record<TabOptions<'date'>['mode'], string> = {
  single: 'Tap a day',
  range: 'Tap check-in, then check-out',
  multiple: 'Tap days to toggle them',
  ranges: 'Pick as many stays as you like',
};

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const CITIES = [
  { label: 'Amsterdam', flag: '🇳🇱', group: 'Europe' },
  { label: 'Berlin', flag: '🇩🇪', group: 'Europe' },
  { label: 'Lisbon', flag: '🇵🇹', group: 'Europe' },
  { label: 'Paris', flag: '🇫🇷', group: 'Europe' },
  { label: 'New York', flag: '🇺🇸', group: 'Americas' },
  { label: 'Mexico City', flag: '🇲🇽', group: 'Americas' },
  { label: 'Tel Aviv', flag: '🇮🇱', group: 'Middle East' },
  { label: 'Dubai', flag: '🇦🇪', group: 'Middle East' },
  { label: 'Tokyo', flag: '🇯🇵', group: 'Asia' },
  { label: 'Seoul', flag: '🇰🇷', group: 'Asia' },
];

export const DEFAULT_CITIES = ['Lisbon', 'Tokyo'];

export const CABINS = ['Economy', 'Premium', 'Business', 'First'].map((c) => ({
  label: c,
  value: c,
}));
