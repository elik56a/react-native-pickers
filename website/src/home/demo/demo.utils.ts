import type { DateRange, MarkedDate } from '@elik56a/react-native-pickers';
import { toDateKey } from '@elik56a/react-native-pickers';
import { PLATFORM } from '../device/device.constants';
import type { Platform } from '../device/device.types';
import type { DemoTab, PlaygroundOptions, TabOptions } from '../playground/playground.types';
import { DATE_SUBTITLES, DAY_MS, PHONE_STATUS_BAR, PRICE_DAYS, WEEKDAY_PRICE, WEEKEND_PRICE } from './demo.constants';
import type { Guests } from './demo.types';

export const startOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const daysFromNow = (days: number) => new Date(+startOfToday() + days * DAY_MS);

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

export const stayNights = ({ start, end }: DateRange) => (start && end ? daysBetween(start, end) : 0);

export const stayTotal = (range: DateRange) => {
  const first = range.start ? daysBetween(startOfToday(), range.start) : 0;
  return Array.from({ length: stayNights(range) }, (_, i) => nightlyPrice(first + i)).reduce((sum, price) => sum + price, 0);
};

const plural = (n: number, word: string, many = `${word}s`) => `${n} ${n === 1 ? word : many}`;

export const adultsLabel = (n: number) => plural(n, 'adult');
export const childrenLabel = (n: number) => plural(n, 'child', 'children');

export const guestsLabel = ({ adults, children }: Guests) =>
  children ? `${adultsLabel(adults)}, ${childrenLabel(children)}` : adultsLabel(adults);

/** Sheets inside the mock phone stop under its status bar and clear its home indicator. */
export const deviceSheetProps = (platform: Platform, screenHeight?: number) => ({
  bottomInset: platform === PLATFORM.ios ? 30 : 16,
  draggable: true,
  expandedHeight: screenHeight ? screenHeight - PHONE_STATUS_BAR : undefined,
});

const SUBTITLES: { [T in DemoTab]: (o: TabOptions<T>) => string } = {
  date: (o) => `${DATE_SUBTITLES[o.mode]}${o.prices ? ' · nightly prices' : ''}`,
  time: (o) => `${o.minuteInterval}-minute steps, ${o.format === 'auto' ? 'locale' : o.format} clock`,
  wheel: (o) => `${o.loop ? 'Looping' : 'Bounded'} ${o.variant === '3d' ? '3D' : 'flat'} wheel`,
  select: () => 'Tap a field to pick',
  emoji: () => '1,906 emojis with search',
};

/** The line under the screen title, describing the props the visitor picked. */
export const demoSubtitle = (tab: DemoTab, options: PlaygroundOptions) => {
  // `options[tab]` is the entry for `tab`; TypeScript can't tie the two together through the index.
  const subtitle = SUBTITLES[tab] as (o: PlaygroundOptions[DemoTab]) => string;
  return subtitle(options[tab]);
};
