import type { DateRange, MarkedDate } from '@elik56a/react-native-pickers';
import { toDateKey } from '@elik56a/react-native-pickers';
import { PLATFORM } from '../device/device.constants';
import type { Platform } from '../device/device.types';
import { DAY_MS, PHONE_STATUS_BAR, PRICE_DAYS, WEEKDAY_PRICE, WEEKEND_PRICE } from './demo.constants';
import type { BookedDates, Guests } from './demo.types';

export const startOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const daysFromNow = (days: number) => new Date(+startOfToday() + days * DAY_MS);

export const daysFromNowAt = (days: number, hours: number, minutes = 0) => {
  const date = daysFromNow(days);
  date.setHours(hours, minutes);
  return date;
};

export const stay = (from: number, to: number): DateRange => ({
  start: daysFromNow(from),
  end: daysFromNow(to),
});

const isWeekendNight = (day: Date) => day.getDay() === 5 || day.getDay() === 6;

/** The price of the night `daysAhead` from today, higher on weekends, so the marked dates look like a real booking calendar. */
export const nightlyPrice = (daysAhead: number) =>
  (isWeekendNight(daysFromNow(daysAhead)) ? WEEKEND_PRICE : WEEKDAY_PRICE) + ((daysAhead * 7) % 30);

export const buildPrices = (): Record<string, MarkedDate> =>
  Object.fromEntries(Array.from({ length: PRICE_DAYS }, (_, i) => [toDateKey(daysFromNow(i)), { label: `$${nightlyPrice(i)}` }]));

const daysBetween = (from: Date, to: Date) => Math.round((+to - +from) / DAY_MS);

const rangeNights = ({ start, end }: DateRange) =>
  start && end ? Array.from({ length: daysBetween(start, end) }, (_, i) => new Date(+start + i * DAY_MS)) : [];

/** The nights a Dates pick books in any calendar mode: each day picked, or every night of each stay up to its check-out day. */
export const bookedNights = (picked: BookedDates): Date[] => {
  if (!picked) return [];
  if (picked instanceof Date) return [picked];
  if (Array.isArray(picked)) return (picked as (Date | DateRange)[]).flatMap((p) => (p instanceof Date ? [p] : rangeNights(p)));
  return rangeNights(picked);
};

export const nightsTotal = (nights: Date[]) => nights.reduce((sum, night) => sum + nightlyPrice(daysBetween(startOfToday(), night)), 0);

export const plural = (n: number, word: string, many = `${word}s`) => `${n} ${n === 1 ? word : many}`;

/** Options for a list of labels, each its own value. */
export const labelOptions = <T extends string>(labels: readonly T[]) =>
  labels.map((label) => ({
    label,
    value: label,
  }));

export const adultsLabel = (n: number) => plural(n, 'adult');
export const childrenLabel = (n: number) => plural(n, 'child', 'children');

export const guestsLabel = ({ adults, children }: Guests) =>
  children ? `${adultsLabel(adults)}, ${childrenLabel(children)}` : adultsLabel(adults);

/**
 * Sheets inside the mock phone stop under its status bar and clear its home indicator. A sheet caps its height against the browser
 * window, which is taller than the phone, so the cap is the phone's screen as a fraction of the window.
 */
// ponytail: the cap is worked out on render, so resizing the window while a sheet is open keeps the old cap until the phone re-renders
export const deviceSheetProps = (
  platform: Platform,
  screenHeight?: number,
  windowHeight = typeof window === 'undefined' ? undefined : window.innerHeight
) => {
  const available = screenHeight ? screenHeight - PHONE_STATUS_BAR : undefined;
  return {
    bottomInset: platform === PLATFORM.ios ? 30 : 16,
    draggable: true,
    expandedHeight: available,
    maxHeightRatio: available && windowHeight ? Math.min(1, available / windowHeight) : undefined,
  };
};
