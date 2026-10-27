import { DEMO_TABS, TAB_LABELS } from '../playground/playground.constants';
import type { DemoTab, TabOptions } from '../playground/playground.types';
import type { TourStep, TourTrip } from './demo.types';

export const TAB_FADE_MS = 280;
export const DAY_MS = 864e5;
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

export const DEMO_TAB_ITEMS = DEMO_TABS.map((tab) => ({
  label: TAB_LABELS[tab],
  value: tab,
}));

export const BOOKING_CITY = 'Lisbon';
export const BOOKING_STAY = { from: 2, to: 5 };
export const CHECK_IN_HOUR = 15;
export const CHECK_IN_INTERVAL = 15;
export const ADULTS = Array.from({ length: 8 }, (_, i) => i + 1);
export const CHILDREN = Array.from({ length: 7 }, (_, i) => i);
export const DEFAULT_GUESTS = { adults: 2, children: 0 };
export const RESERVING_MS = 1400;
export const RESERVED_MS = 2400;
export const RESERVED_POP_FROM = 0.6;

export const RESERVE_PHASE = {
  idle: 'idle',
  reserving: 'reserving',
  reserved: 'reserved',
} as const;
export const RESERVE_TEST_ID = 'booking-reserve';

export const BOOKING_FIELD = {
  where: 'Where',
  dates: 'Dates',
  checkIn: 'Check-in',
  guests: 'Guests',
} as const;

/** Each loop of the tour books another trip: a city, then the nth and mth days from today, which every month view shows. */
export const TOUR_TRIPS: TourTrip[] = [
  { city: 'Tokyo', from: 3, to: 6 },
  { city: 'Lisbon', from: 1, to: 4 },
];

export const TOUR_STEPS: TourStep[] = [
  { target: { kind: 'field', label: BOOKING_FIELD.where }, pause: 900 },
  { target: { kind: 'option' }, pause: 1200 },
  { target: { kind: 'field', label: BOOKING_FIELD.dates }, pause: 1000 },
  { target: { kind: 'day', end: 'from' }, pause: 1200 },
  { target: { kind: 'day', end: 'to' }, pause: 700 },
  { target: { kind: 'confirm' }, pause: 1100 },
  { target: { kind: 'field', label: BOOKING_FIELD.checkIn }, pause: 1000 },
  { target: { kind: 'confirm' }, pause: 2400 },
  { target: { kind: 'field', label: BOOKING_FIELD.guests }, pause: 1000 },
  { target: { kind: 'confirm' }, pause: 2000 },
  { target: { kind: 'reserve' }, pause: 1000 },
];

export const TOUR_START_MS = 1800;
export const TOUR_LOOP_MS = 4500;
export const TOUR_MOVE_MS = 550;
export const TOUR_PRESS_MS = 200;
export const CONFIRM_LABELS = ['Done', 'OK'];
/** How the calendar names its day cells for screen readers, which is how the tour finds them. */
export const DAY_LABEL_FORMAT: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
/** How far ahead the tour looks for days to book. */
export const TOUR_DAYS_AHEAD = 60;
