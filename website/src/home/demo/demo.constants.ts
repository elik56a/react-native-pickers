import type { CountryCode } from '@elik56a/react-native-pickers';

export const DAY_MS = 864e5;
/** Keeps an expanded sheet below the mock status bar. */
export const PHONE_STATUS_BAR = 52;
export const PRICE_DAYS = 120;
export const WEEKDAY_PRICE = 89;
export const WEEKEND_PRICE = 149;
export const SELECT_LIST_HEIGHT = 240;
export const MAX_CITIES = 4;
export const DEFAULT_VIBE = '🌴';

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

export const BOOKING_CITY = 'Lisbon';
export const BOOKING_COUNTRY: CountryCode = 'US';
export const PREFERRED_COUNTRIES: CountryCode[] = ['US', 'GB', 'DE'];
export const BOOKING_STAY = { from: 2, to: 5 };
/** What the Dates field starts with in its other modes: days ahead of today, and stays as [from, to]. */
export const BOOKING_DAY = 2;
export const BOOKING_DAYS = [2, 5, 9];
export const BOOKING_STAYS = [
  [1, 3],
  [8, 11],
] as const;
export const CHECK_IN_HOUR = 15;
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

export const BOOKING_FIELD = {
  where: 'Where',
  dates: 'Dates',
  checkIn: 'Check-in',
  guests: 'Guests',
  vibe: 'Vibe',
  country: 'Country',
} as const;
