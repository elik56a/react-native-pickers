import type { DateRange, MarkedDate } from '@elik56a/react-native-pickers';
import { toDateKey } from '@elik56a/react-native-pickers';
import type { DemoTab, PlaygroundOptions, TabOptions } from '../playground/playground.types';
import { DATE_SUBTITLES, DAY_MS, PRICE_DAYS, WEEKDAY_PRICE, WEEKEND_PRICE } from './demo.constants';

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

/** Nightly prices that rise on weekends, so the marked dates look like a real booking calendar. */
export const buildPrices = (): Record<string, MarkedDate> =>
  Object.fromEntries(
    Array.from({ length: PRICE_DAYS }, (_, i) => {
      const day = daysFromNow(i);
      const base = isWeekendNight(day) ? WEEKEND_PRICE : WEEKDAY_PRICE;
      return [toDateKey(day), { label: `$${base + ((i * 7) % 30)}` }];
    })
  );

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
