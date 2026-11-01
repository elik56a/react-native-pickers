import type { CurrencyCode, DateRangePreset } from '@elik56a/react-native-pickers';
import { getCurrency, toDateKey } from '@elik56a/react-native-pickers';
import { daysFromNow } from '../home/demo/demo.utils';
import {
  ALBUM_SORT,
  APPLICATION,
  APPLICATION_ERRORS,
  CLOSED_WEEKDAY,
  EXCHANGE_SIDE,
  HOURS_IN_DAY,
  LAUNCH_PRESETS,
  MIN_PREVIEW_OPACITY,
  QUICK_AMOUNTS,
  RATE_PRECISION,
  RATES,
  TEXT_SIZES,
  TIMER_PRESETS,
} from './showcase.constants';
import type { Album, AlbumSort, ApplicationErrors, ApplicationValues, ExchangeAmounts, TextSelection, TypedAmount } from './showcase.types';

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

const phoneError = ({ phone, phoneValid }: ApplicationValues) => {
  if (!phone) return APPLICATION_ERRORS.phone;
  return phoneValid ? undefined : APPLICATION_ERRORS.phoneIncomplete;
};

/** The pickers keep each value in range; the interview falling before the first day spans two fields, so the form checks it. */
const interviewError = ({ interview, startDate }: ApplicationValues) => {
  if (!interview) return APPLICATION_ERRORS.interview;
  return startDate && toDateKey(interview) >= toDateKey(startDate) ? APPLICATION_ERRORS.interviewAfterStart : undefined;
};

/** The application's errors by field, empty once it can be sent. */
export const validateApplication = (values: ApplicationValues): ApplicationErrors => {
  const errors: ApplicationErrors = {
    role: values.role ? undefined : APPLICATION_ERRORS.role,
    country: values.country ? undefined : APPLICATION_ERRORS.country,
    phone: phoneError(values),
    startDate: values.startDate ? undefined : APPLICATION_ERRORS.startDate,
    interview: interviewError(values),
    skills: values.skills.length < APPLICATION.minSkills ? APPLICATION_ERRORS.skills : undefined,
  };
  return Object.fromEntries(Object.entries(errors).filter(([, error]) => error));
};

export const attentionLabel = (count: number) => `${count} ${count === 1 ? 'field needs' : 'fields need'} attention`;

/** The launch sale's presets as ranges of days from today. */
export const launchPresets = (): DateRangePreset[] =>
  LAUNCH_PRESETS.map(({ label, from, to }) => ({
    label,
    start: daysFromNow(from),
    end: daysFromNow(to),
  }));

/** The demo only offers the currencies it has rates for. */
const rateOf = (code: CurrencyCode) => RATES[code] ?? 1;

/** `amount` in `from` as `to`, rounded to `to`'s decimal places: none for the yen. */
export const convertAmount = (amount: number | null, from: CurrencyCode, to: CurrencyCode) => {
  if (amount === null) return null;
  const factor = 10 ** (getCurrency(to)?.decimals ?? 2);
  return Math.round(((amount * rateOf(to)) / rateOf(from)) * factor) / factor;
};

/** Both sides of a transfer: the one the user typed, and the other converted from it. */
export const getExchangeAmounts = ({ side, amount }: TypedAmount, from: CurrencyCode, to: CurrencyCode): ExchangeAmounts => {
  if (side === EXCHANGE_SIDE.send) {
    return {
      send: amount,
      receive: convertAmount(amount, from, to),
    };
  }
  return {
    send: convertAmount(amount, to, from),
    receive: amount,
  };
};

export const formatRate = (from: CurrencyCode, to: CurrencyCode) =>
  `1 ${from} = ${Number((rateOf(to) / rateOf(from)).toPrecision(RATE_PRECISION))} ${to}`;

/** In the device locale, with the currency's decimal places unless `fractionDigits` says otherwise: $25.00, or $25 with 0. */
export const formatMoney = (amount: number, currency: CurrencyCode, fractionDigits?: number) =>
  new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);

export const quickAmountItems = (currency: CurrencyCode) =>
  QUICK_AMOUNTS.map((amount) => ({
    label: formatMoney(amount, currency, 0),
    value: amount,
  }));
