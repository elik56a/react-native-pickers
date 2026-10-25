import { addDays, clampDate, formatDate, isSameDay, startOfDay } from '../core/utils/date.utils';
import type { WheelItem } from '../wheel/wheel.types';
import { DAY_LABEL_FORMAT, DEFAULT_DAY_SPAN, FALLBACK_TODAY_LABEL } from './datetime.constants';

/** `date` moved to the day of `day`, keeping its time and staying within min/max. */
export const withDay = (date: Date, day: Date, minDate?: Date, maxDate?: Date) => {
  const next = new Date(date);
  next.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());
  return clampDate(next, minDate, maxDate);
};

/** On the min (max) day only the times after (before) it are selectable. */
export const getDayTimeBounds = (date: Date, minDate?: Date, maxDate?: Date) => ({
  minTime: isSameDay(date, minDate) ? minDate : undefined,
  maxTime: isSameDay(date, maxDate) ? maxDate : undefined,
});

/** First and last day of the day wheel, as midnight timestamps: min/max dates, else a year either side of today, widened to hold `date`. */
export const getDayWheelBounds = (date: Date, minDate?: Date, maxDate?: Date, today = new Date()): [number, number] => {
  const day = startOfDay(date).getTime();
  const first = minDate ? startOfDay(minDate).getTime() : Math.min(startOfDay(addDays(today, -DEFAULT_DAY_SPAN)).getTime(), day);
  const last = maxDate ? startOfDay(maxDate).getTime() : Math.max(startOfDay(addDays(today, DEFAULT_DAY_SPAN)).getTime(), day);
  return [first, last];
};

export const getTodayLabel = (locale?: string) => {
  try {
    const label = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(0, 'day');
    return label.charAt(0).toLocaleUpperCase(locale) + label.slice(1);
  } catch {
    return FALLBACK_TODAY_LABEL;
  }
};

export const formatDayLabel = (date: Date, locale?: string, today = new Date()) =>
  isSameDay(date, today) ? getTodayLabel(locale) : formatDate(date, locale, DAY_LABEL_FORMAT);

/** One wheel row per day from `first` to `last`; each value is the day's midnight timestamp. */
export const getDayItems = (
  [first, last]: [number, number],
  format: (date: Date, locale?: string) => string,
  locale?: string
): WheelItem<number>[] => {
  const items: WheelItem<number>[] = [];
  for (let day = new Date(first); day.getTime() <= last; day = addDays(day, 1)) {
    items.push({
      value: day.getTime(),
      label: format(day, locale),
    });
  }
  return items;
};
