import type { PhoneFormat } from './country.types';
import type { CountryCode } from './data';

export const DEFAULT_COUNTRY_PLACEHOLDER = 'Select a country';
export const DEFAULT_COUNTRY_SEARCH_PLACEHOLDER = 'Search countries';
export const DEFAULT_ALL_COUNTRIES_LABEL = 'All countries';

export const FLAG_SIZE = 22;

/** Regional indicator symbol 🇦: a flag emoji is the two letters of its ISO code, shifted into this block. */
export const REGIONAL_INDICATOR_A = 0x1f1e6;

export const DEFAULT_PHONE_COUNTRY: CountryCode = 'US';
export const DEFAULT_PHONE_LABEL = 'Phone number';
export const PHONE_COUNTRY_BUTTON_LABEL = 'Country code';
/** E.164: at most 15 digits, calling code included. */
export const E164_MAX_DIGITS = 15;
export const PHONE_MIN_DIGITS = 4;
/** Groups for countries without their own pattern. */
export const DEFAULT_PHONE_PATTERN = '### ### ### ###';
/** Digits that fill a pattern to show it as the placeholder. */
export const PHONE_PLACEHOLDER_DIGITS = '1234567890123';
/** Where a leading 0 is part of the number, not a trunk prefix to drop. */
export const KEEPS_LEADING_ZERO: ReadonlySet<string> = new Set(['IT', 'SM', 'VA']);

/**
 * How the most-used countries group a number after the calling code (`#` is a digit), and how many digits it has.
 * Countries sharing a calling code with one here (Canada, Caribbean islands, Kazakhstan…) use its pattern.
 */
export const PHONE_FORMATS: Partial<Record<CountryCode, PhoneFormat>> = {
  US: { pattern: '(###) ###-####', min: 10, max: 10 },
  CA: { pattern: '(###) ###-####', min: 10, max: 10 },
  GB: { pattern: '#### ######', min: 9, max: 10 },
  IE: { pattern: '## ### ####', min: 7, max: 9 },
  FR: { pattern: '# ## ## ## ##', min: 9, max: 9 },
  DE: { pattern: '### ########', min: 6, max: 11 },
  ES: { pattern: '### ## ## ##', min: 9, max: 9 },
  IT: { pattern: '### ### ####', min: 6, max: 11 },
  PT: { pattern: '### ### ###', min: 9, max: 9 },
  NL: { pattern: '# ########', min: 9, max: 9 },
  BE: { pattern: '### ## ## ##', min: 8, max: 9 },
  CH: { pattern: '## ### ## ##', min: 9, max: 9 },
  AT: { pattern: '### #######', min: 4, max: 13 },
  SE: { pattern: '##-### ## ##', min: 7, max: 9 },
  NO: { pattern: '### ## ###', min: 8, max: 8 },
  DK: { pattern: '## ## ## ##', min: 8, max: 8 },
  FI: { pattern: '## ### ####', min: 5, max: 10 },
  PL: { pattern: '### ### ###', min: 9, max: 9 },
  GR: { pattern: '### ### ####', min: 10, max: 10 },
  RU: { pattern: '### ###-##-##', min: 10, max: 10 },
  UA: { pattern: '## ### ## ##', min: 9, max: 9 },
  TR: { pattern: '### ### ## ##', min: 10, max: 10 },
  IL: { pattern: '##-###-####', min: 8, max: 9 },
  AE: { pattern: '## ### ####', min: 8, max: 9 },
  SA: { pattern: '## ### ####', min: 9, max: 9 },
  EG: { pattern: '### ### ####', min: 10, max: 10 },
  ZA: { pattern: '## ### ####', min: 9, max: 9 },
  NG: { pattern: '### ### ####', min: 10, max: 10 },
  IN: { pattern: '##### #####', min: 10, max: 10 },
  PK: { pattern: '### #######', min: 10, max: 10 },
  BD: { pattern: '####-######', min: 10, max: 10 },
  CN: { pattern: '### #### ####', min: 11, max: 11 },
  JP: { pattern: '##-####-####', min: 9, max: 10 },
  KR: { pattern: '##-####-####', min: 9, max: 10 },
  ID: { pattern: '###-####-####', min: 9, max: 12 },
  PH: { pattern: '### ### ####', min: 10, max: 10 },
  VN: { pattern: '## ### ## ##', min: 9, max: 9 },
  TH: { pattern: '## ### ####', min: 8, max: 9 },
  MY: { pattern: '##-### ####', min: 9, max: 10 },
  SG: { pattern: '#### ####', min: 8, max: 8 },
  AU: { pattern: '### ### ###', min: 9, max: 9 },
  NZ: { pattern: '## ### ####', min: 8, max: 10 },
  BR: { pattern: '(##) #####-####', min: 10, max: 11 },
  MX: { pattern: '## #### ####', min: 10, max: 10 },
  AR: { pattern: '## ####-####', min: 10, max: 10 },
  CO: { pattern: '### #######', min: 10, max: 10 },
  CL: { pattern: '# #### ####', min: 9, max: 9 },
  PE: { pattern: '### ### ###', min: 9, max: 9 },
};
