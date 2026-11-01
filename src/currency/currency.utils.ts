import type { Locale } from '../core';
import { getCompare, getDisplayNames, safe } from '../core/utils/intl.utils';
import type { SelectOption } from '../select';
import { DEFAULT_PREFERRED_LABEL } from '../select/select.constants';
import { pinPreferred } from '../select/select.utils';
import {
  DEFAULT_ALL_CURRENCIES_LABEL,
  DEFAULT_CURRENCY,
  DEFAULT_SEPARATORS,
  LARGE_AMOUNT_FIT_CHARS,
  LARGE_AMOUNT_FONT_SIZE,
  MAX_INTEGER_DIGITS,
  MIN_LARGE_AMOUNT_FONT_SIZE,
  SYMBOL_POSITION,
} from './currency.constants';
import type {
  AmountFormat,
  AmountInput,
  Currency,
  CurrencyCode,
  CurrencyListOptions,
  NumberSeparators,
  SymbolPosition,
} from './currency.types';
import { RAW_CURRENCY_DATA } from './data';

let cache: Currency[] | null = null;
let byCode: Map<string, Currency> | null = null;

/** One tab-separated line of the generated data: code, name, symbol, decimals, flag region. */
const parseLine = (line: string): Currency => {
  const [code = '', name = '', symbol = '', decimals = '2', country = ''] = line.split('\t');
  return {
    code: code as CurrencyCode,
    name,
    symbol,
    decimals: Number(decimals),
    country: country || undefined,
  };
};

export const getAllCurrencies = (): Currency[] => {
  cache ??= RAW_CURRENCY_DATA.split('\n').map(parseLine);
  return cache;
};

export const getCurrency = (code: string): Currency | undefined => {
  byCode ??= new Map(getAllCurrencies().map((c) => [c.code, c]));
  return byCode.get(code.toUpperCase());
};

/** The currency's name in `locale`, or in English where the engine can't name it. */
export const getCurrencyName = (currency: Currency, locale?: Locale) =>
  safe(() => getDisplayNames('currency', locale)?.of(currency.code), currency.name);

export const buildCurrencyOptions = ({
  currencies,
  exclude,
  preferred,
  locale,
  preferredLabel = DEFAULT_PREFERRED_LABEL,
  allCurrenciesLabel = DEFAULT_ALL_CURRENCIES_LABEL,
}: CurrencyListOptions): SelectOption<CurrencyCode>[] => {
  const excluded = new Set(exclude);
  const pool = (currencies ? currencies.flatMap((code) => getCurrency(code) ?? []) : getAllCurrencies()).filter(
    (c) => !excluded.has(c.code)
  );
  const { pinned, rest } = pinPreferred(pool, preferred ?? [], (c) => c.code);
  const toOption = (currency: Currency, group?: string) => ({
    label: getCurrencyName(currency, locale),
    value: currency.code,
    description: currency.symbol === currency.code ? currency.code : `${currency.code} · ${currency.symbol}`,
    group,
    keywords: [currency.code, currency.symbol, currency.name],
  });
  const compare = getCompare(locale);
  const others = rest.map((c) => toOption(c, pinned.length ? allCurrenciesLabel : undefined)).sort((a, b) => compare(a.label, b.label));
  return [...pinned.map((c) => toOption(c, preferredLabel)), ...others];
};

const formats = new Map<string, Intl.NumberFormat | null>();

/** Whole numbers in `locale`'s grouping (1,234,567, or 12,34,567 in India), in Latin digits so typing can read them back. */
const getIntegerFormat = (locale?: Locale) => {
  const key = locale ?? '';
  if (!formats.has(key)) {
    formats.set(
      key,
      safe(() => new Intl.NumberFormat(locale, { maximumFractionDigits: 0, numberingSystem: 'latn' }), null)
    );
  }
  return formats.get(key) ?? null;
};

const separators = new Map<string, NumberSeparators>();

/** The group and decimal separators `locale` writes numbers with: ',' and '.' in English, '.' and ',' in German. */
export const getNumberSeparators = (locale?: Locale): NumberSeparators => {
  const key = locale ?? '';
  const cached = separators.get(key);
  if (cached) return cached;
  // Latin digits' separators, as the digits are Latin too: Arabic's own (٬ ٫) would show as 1,234٫5.
  const parts = safe(() => new Intl.NumberFormat(locale, { numberingSystem: 'latn' }).formatToParts(1234.5), []);
  const found = {
    group: parts.find((p) => p.type === 'group')?.value ?? DEFAULT_SEPARATORS.group,
    decimal: parts.find((p) => p.type === 'decimal')?.value ?? DEFAULT_SEPARATORS.decimal,
  };
  separators.set(key, found);
  return found;
};

/** Whether `locale` writes the symbol before the amount ($12) or after it (12 €). */
export const getSymbolPosition = (code: CurrencyCode, locale?: Locale): SymbolPosition => {
  const parts = safe(() => new Intl.NumberFormat(locale, { style: 'currency', currency: code }).formatToParts(1), []);
  const symbol = parts.findIndex((p) => p.type === 'currency');
  const number = parts.findIndex((p) => p.type === 'integer');
  return symbol > number && number !== -1 ? SYMBOL_POSITION.after : SYMBOL_POSITION.before;
};

const groupDigits = (digits: string, { separators: { group }, locale }: AmountFormat) =>
  getIntegerFormat(locale)?.format(Number(digits)) ?? digits.replace(/\B(?=(\d{3})+(?!\d))/g, group);

/** Arabic-Indic (٠–٩) and Persian (۰–۹) digits as 0–9, and the Arabic decimal key (٫) as '.', as those keyboards type them. */
const toLatinDigits = (text: string) =>
  text.replace(/[\u0660-\u0669\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - (d >= '\u06F0' ? 0x06f0 : 0x0660))).replace(/\u066B/g, '.');

/**
 * The decimal key types the device's separator, not the field's locale's: a German field on an English phone gets '.'. Where the
 * locale groups with neither '.' nor ',' (French), either is the decimal; otherwise the other one is, when just typed at the end.
 */
const readDecimalKey = (typed: string, { group, decimal }: NumberSeparators) => {
  const other = decimal === '.' ? ',' : '.';
  if (group !== '.' && group !== ',') return typed.split(other).join(decimal);
  return !typed.includes(decimal) && typed.endsWith(other) ? typed.slice(0, -1) + decimal : typed;
};

/**
 * Reads what the user typed or pasted ('$1,234.5', '1234,5' in German) into the text to show, grouped as they type, and the
 * amount. Anything but digits and the first decimal separator is dropped, and so are digits past the currency's decimals.
 */
export const parseAmountInput = (typed: string, format: AmountFormat): AmountInput => {
  const { decimals, separators: sep } = format;
  const [whole = '', ...rest] = readDecimalKey(toLatinDigits(typed), sep).split(sep.group).join('').split(sep.decimal);
  const digits = whole
    .replace(/\D/g, '')
    .replace(/^0+(?=\d)/, '')
    .slice(0, MAX_INTEGER_DIGITS);
  const hasPoint = decimals > 0 && rest.length > 0;
  const fraction = rest.join('').replace(/\D/g, '').slice(0, decimals);
  if (!digits && !hasPoint) {
    return {
      text: '',
      value: null,
    };
  }
  const integer = digits || '0';
  return {
    text: groupDigits(integer, format) + (hasPoint ? sep.decimal + fraction : ''),
    value: Number(`${integer}.${fraction || '0'}`),
  };
};

/** An amount as the field shows it once typing ends: whole amounts bare (12), others with every decimal place (12.50). */
export const formatAmount = (value: number | null, format: AmountFormat) => {
  if (value === null) return '';
  const [integer = '0', fraction] = Math.abs(value)
    .toFixed(Number.isInteger(value) ? 0 : format.decimals)
    .split('.');
  return (value < 0 ? '-' : '') + groupDigits(integer, format) + (fraction ? format.separators.decimal + fraction : '');
};

/** Zero with every decimal place, as the empty field's hint: '0.00', or '0' for the yen. */
export const getAmountPlaceholder = ({ decimals, separators }: AmountFormat) =>
  decimals > 0 ? `0${separators.decimal}${'0'.repeat(decimals)}` : '0';

/** The currency, or the default one for a code the list doesn't have. */
export const resolveCurrency = (code: string) => getCurrency(code) ?? (getCurrency(DEFAULT_CURRENCY) as Currency);

/** The large amount's font size: full size for a short amount, shrinking as it grows so it stays on one line. */
export const getLargeAmountFontSize = (length: number) =>
  Math.round(
    Math.max(MIN_LARGE_AMOUNT_FONT_SIZE, Math.min(LARGE_AMOUNT_FONT_SIZE, (LARGE_AMOUNT_FONT_SIZE * LARGE_AMOUNT_FIT_CHARS) / length))
  );
