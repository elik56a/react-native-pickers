import type { Locale } from '../core';
import type { CountryCode } from '../country';
import type { BuiltInSelectPickerProps } from '../select/select.types';
import type { LANGUAGE_DATA } from './data';

/** A BCP 47 tag from the built-in list, e.g. 'es', 'pt-BR' or 'zh-Hant' */
export type LanguageCode = (typeof LANGUAGE_DATA)[number][0];

export interface Language {
  code: LanguageCode;
  /** English name */
  name: string;
  /** The language's name in itself, e.g. 'Español' */
  nativeName: string;
  /** The country whose flag stands for it, e.g. 'ES' */
  country: CountryCode;
  /** Written right to left, such as Arabic and Hebrew */
  rtl: boolean;
}

export interface LanguageListOptions {
  /** Only these languages. Default: all */
  languages?: ReadonlyArray<LanguageCode>;
  /** Leave these out */
  exclude?: ReadonlyArray<LanguageCode>;
  /** Shown first, in this order, under their own header, such as the device's languages */
  preferred?: ReadonlyArray<LanguageCode>;
  /** Language of the names under each language's own name, through `Intl.DisplayNames`; English where it's unsupported. Default: the device locale */
  locale?: Locale;
  /** A flag before each language: the country it's most spoken in, such as 🇪🇸 for Español. Default: true */
  showFlag?: boolean;
  /** Other flags for some languages, such as `{ en: 'GB' }` */
  flags?: Partial<Record<LanguageCode, CountryCode>>;
  /** Header above `preferred`. Default: 'Suggested' */
  preferredLabel?: string;
  /** Header above the rest when `preferred` is set. Default: 'All languages' */
  allLanguagesLabel?: string;
}

export type LanguagePickerProps = BuiltInSelectPickerProps<LanguageCode> & LanguageListOptions;
