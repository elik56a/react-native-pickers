import type { Locale } from '../core';
import { safe } from '../core/utils/intl.utils';
import type { SelectOption } from '../select';
import { COUNTRY_SHEET_HEIGHT, DEFAULT_ALL_COUNTRIES_LABEL, DEFAULT_PREFERRED_LABEL, REGIONAL_INDICATOR_A } from './country.constants';
import type { Country, CountryCode, CountryListOptions, CountryPickerProps } from './country.types';
import { RAW_COUNTRY_DATA } from './data';

let cache: Country[] | null = null;
let byCode: Map<string, Country> | null = null;
const displayNames = new Map<string, Intl.DisplayNames | null>();

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

/** Cached per locale; null where the engine has no `Intl.DisplayNames` or doesn't know the locale. */
const getDisplayNames = (locale?: Locale) => {
  const key = locale ?? '';
  if (!displayNames.has(key)) {
    displayNames.set(
      key,
      safe(() => new Intl.DisplayNames(locale, { type: 'region', fallback: 'none' }), null)
    );
  }
  return displayNames.get(key) ?? null;
};

/** The country's name in `locale`, or its English name. */
export const getLocalizedName = (country: Country, locale?: Locale) => safe(() => getDisplayNames(locale)?.of(country.code), country.name);

const getCompare = (locale?: Locale) =>
  safe(
    () => new Intl.Collator(locale).compare,
    (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0)
  );

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
  const allowed = new Map(pool.map((c) => [c.code, c]));
  const pinned = (preferred ?? []).flatMap((code) => allowed.get(code) ?? []);
  const pinnedCodes = new Set(pinned.map((c) => c.code));
  const toOption = (country: Country, group?: string): SelectOption<CountryCode> => ({
    label: getLocalizedName(country, locale),
    value: country.code,
    description: showDialCode ? country.dialCode : undefined,
    group,
    keywords: [country.code, country.name, country.nativeName ?? '', country.dialCode, ...country.keywords],
  });
  const compare = getCompare(locale);
  const rest = pool
    .filter((c) => !pinnedCodes.has(c.code))
    .map((c) => toOption(c, pinned.length ? allCountriesLabel : undefined))
    .sort((a, b) => compare(a.label, b.label));
  return [...pinned.map((c) => toOption(c, preferredLabel)), ...rest];
};

/** A long list opens the sheet at a fixed height, so it doesn't jump as search narrows it. */
export const withSheetHeight = (sheet: CountryPickerProps['sheet']): CountryPickerProps['sheet'] => ({
  ...sheet,
  sheetProps: {
    height: COUNTRY_SHEET_HEIGHT,
    ...sheet?.sheetProps,
  },
});
