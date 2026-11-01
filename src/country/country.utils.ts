import type { Locale } from '../core';
import { getCompare, getDisplayNames, safe } from '../core/utils/intl.utils';
import type { SelectOption } from '../select';
import { DEFAULT_PREFERRED_LABEL } from '../select/select.constants';
import { pinPreferred } from '../select/select.utils';
import {
  DEFAULT_ALL_COUNTRIES_LABEL,
  DEFAULT_PHONE_PATTERN,
  E164_MAX_DIGITS,
  KEEPS_LEADING_ZERO,
  PHONE_FORMATS,
  PHONE_MIN_DIGITS,
  PHONE_PLACEHOLDER_DIGITS,
  REGIONAL_INDICATOR_A,
} from './country.constants';
import type { Country, CountryCode, CountryListOptions, ParsedPhone, PhoneFormat } from './country.types';
import { RAW_COUNTRY_DATA } from './data';

let cache: Country[] | null = null;
let byCode: Map<string, Country> | null = null;

/** The flag emoji for an ISO 3166-1 alpha-2 code, e.g. 'IL' → 🇮🇱. */
export const getCountryFlag = (code: string) =>
  String.fromCodePoint(...Array.from(code.toUpperCase(), (c) => REGIONAL_INDICATOR_A + c.charCodeAt(0) - 65));

/** One tab-separated line of the generated data: code, name, native name, aliases, dialing codes. */
const parseLine = (line: string): Country => {
  const [code = '', name = '', nativeName, aliases, dials = ''] = line.split('\t');
  const [dialCode = '', ...otherDials] = dials.split(',');
  return {
    code: code as CountryCode,
    name,
    nativeName: nativeName || undefined,
    dialCode,
    flag: getCountryFlag(code),
    keywords: [...(aliases ? aliases.split('|') : []), ...otherDials],
  };
};

/** All countries, sorted by code, parsed lazily on first use. */
export const getAllCountries = (): Country[] => {
  cache ??= RAW_COUNTRY_DATA.split('\n').map(parseLine);
  return cache;
};

/** Look up a country by its ISO code, in any case. */
export const getCountry = (code: string): Country | undefined => {
  byCode ??= new Map(getAllCountries().map((c) => [c.code, c]));
  return byCode.get(code.toUpperCase());
};

/** The country's name in `locale`, or its English name. */
export const getLocalizedName = (country: Country, locale?: Locale) =>
  safe(() => getDisplayNames('region', locale)?.of(country.code), country.name);

/**
 * The countries as select options: `preferred` first under their own header, then the rest sorted by name.
 * Labels are localized; search also matches the English and native names, ISO code and dialing codes.
 */
export const buildCountryOptions = ({
  countries,
  exclude,
  preferred,
  locale,
  showDialCode,
  preferredLabel = DEFAULT_PREFERRED_LABEL,
  allCountriesLabel = DEFAULT_ALL_COUNTRIES_LABEL,
}: CountryListOptions): SelectOption<CountryCode>[] => {
  const excluded = new Set(exclude);
  const pool = (countries ? countries.flatMap((code) => getCountry(code) ?? []) : getAllCountries()).filter((c) => !excluded.has(c.code));
  const { pinned, rest } = pinPreferred(pool, preferred ?? [], (c) => c.code);
  const toOption = (country: Country, group?: string): SelectOption<CountryCode> => ({
    label: getLocalizedName(country, locale),
    value: country.code,
    description: showDialCode ? country.dialCode : undefined,
    group,
    keywords: [country.code, country.name, country.nativeName ?? '', country.dialCode, ...country.keywords],
  });
  const compare = getCompare(locale);
  const others = rest.map((c) => toOption(c, pinned.length ? allCountriesLabel : undefined)).sort((a, b) => compare(a.label, b.label));
  return [...pinned.map((c) => toOption(c, preferredLabel)), ...others];
};

const digitsOf = (text: string) => text.replace(/\D/g, '');

/** The calling code's digits, e.g. '1' for Jamaica, whose '+1 876' puts its area code after it. */
export const getCallingCode = (code: CountryCode) => digitsOf(getCountry(code)?.dialCode.split(' ')[0] ?? '');

/** Every dialing prefix a country's numbers start with, as digits: '1876' for Jamaica. */
const dialPrefixes = (country: Country) => [country.dialCode, ...country.keywords.filter((k) => k.startsWith('+'))].map(digitsOf);

let formatByCallingCode: Map<string, PhoneFormat> | null = null;

/** The country's phone format, or that of the first country listed with its calling code: the US's for +1 islands. */
export const getPhoneFormat = (code: CountryCode): PhoneFormat | undefined => {
  if (!formatByCallingCode) {
    formatByCallingCode = new Map();
    for (const [listed, format] of Object.entries(PHONE_FORMATS)) {
      const callingCode = getCallingCode(listed as CountryCode);
      if (format && !formatByCallingCode.has(callingCode)) formatByCallingCode.set(callingCode, format);
    }
  }
  return PHONE_FORMATS[code] ?? formatByCallingCode.get(getCallingCode(code));
};

const maxDigits = (code: CountryCode) => getPhoneFormat(code)?.max ?? E164_MAX_DIGITS - getCallingCode(code).length;

/** Groups the digits by `pattern`, a separator only once a digit follows it; digits past the pattern are kept as they are. */
export const formatPhoneDigits = (digits: string, pattern = DEFAULT_PHONE_PATTERN) => {
  let out = '';
  let used = 0;
  for (const char of pattern) {
    if (used >= digits.length) break;
    out += char === '#' ? digits[used++] : char;
  }
  return out + digits.slice(used);
};

/** The digits after the calling code as the country writes them, e.g. '54-123-4567' in Israel. */
export const formatNationalNumber = (nationalNumber: string, code: CountryCode) =>
  formatPhoneDigits(nationalNumber, getPhoneFormat(code)?.pattern);

/** An example number in the country's format, for the placeholder. */
export const getPhonePlaceholder = (code: CountryCode) =>
  formatNationalNumber(PHONE_PLACEHOLDER_DIGITS.slice(0, getPhoneFormat(code)?.max ?? PHONE_MIN_DIGITS + 6), code);

/**
 * What the user typed, as the digits after the calling code: separators gone, a trunk 0 dropped ('054…' in Israel is
 * '54…'), and cut at the most digits the country's numbers have.
 */
export const toNationalNumber = (typed: string, code: CountryCode) => {
  const digits = digitsOf(typed);
  const national = digits.startsWith('0') && !KEEPS_LEADING_ZERO.has(code) ? digits.slice(1) : digits;
  return national.slice(0, maxDigits(code));
};

/** E.164, e.g. '+972541234567', or '' without a number. */
export const toE164 = (nationalNumber: string, code: CountryCode) => (nationalNumber ? `+${getCallingCode(code)}${nationalNumber}` : '');

/** Whether the number has as many digits as the country's numbers do. */
export const isValidPhone = (nationalNumber: string, code: CountryCode) => {
  const format = getPhoneFormat(code);
  const length = nationalNumber.length;
  return format ? length >= format.min && length <= format.max : length >= PHONE_MIN_DIGITS && length <= maxDigits(code);
};

/**
 * Splits an international number into its country and the digits after the calling code. `current` wins when its
 * calling code matches, so a US number with a Caribbean area code stays American; otherwise the longest dialing
 * prefix wins, and among countries sharing it, the first in `PHONE_FORMATS` (the US over Canada for +1).
 */
export const parsePhone = (international: string, current?: CountryCode): ParsedPhone => {
  const digits = digitsOf(international);
  if (current && digits.startsWith(getCallingCode(current))) {
    return {
      country: current,
      nationalNumber: digits.slice(getCallingCode(current).length),
    };
  }
  let matches: Country[] = [];
  let longest = 0;
  for (const country of getAllCountries()) {
    const prefix = dialPrefixes(country).find((p) => p && digits.startsWith(p) && p.length >= longest);
    if (!prefix) continue;
    if (prefix.length > longest) matches = [];
    longest = prefix.length;
    matches.push(country);
  }
  const listed = Object.keys(PHONE_FORMATS);
  const rank = (c: Country) => (listed.includes(c.code) ? listed.indexOf(c.code) : listed.length);
  const [country] = matches.sort((a, b) => rank(a) - rank(b));
  if (!country) return { nationalNumber: digits };
  return {
    country: country.code,
    nationalNumber: digits.slice(getCallingCode(country.code).length),
  };
};
