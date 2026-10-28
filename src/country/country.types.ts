import type { Locale } from '../core';
import type { DistributiveOmit } from '../core/core.types';
import type { SelectPickerProps } from '../select';
import type { CountryCode } from './data';

export type { CountryCode };

export interface Country {
  /** ISO 3166-1 alpha-2 code, e.g. 'IL' */
  code: CountryCode;
  /** English name */
  name: string;
  /** Name in the country's own language, when it differs from `name` */
  nativeName?: string;
  /** Main international dialing code, e.g. '+972' */
  dialCode: string;
  /** Flag emoji */
  flag: string;
  /** Other names and dialing codes that search matches, e.g. 'USA' */
  keywords: string[];
}

export interface CountryListOptions {
  /** Only these countries. Default: all */
  countries?: ReadonlyArray<CountryCode>;
  /** Leave these out */
  exclude?: ReadonlyArray<CountryCode>;
  /** Shown first, in this order, under their own header */
  preferred?: ReadonlyArray<CountryCode>;
  /** Language of the country names, through `Intl.DisplayNames`; English where it's unsupported. Default: the device locale */
  locale?: Locale;
  /** Show each country's dialing code under its name */
  showDialCode?: boolean;
  /** Header above `preferred`. Default: 'Suggested' */
  preferredLabel?: string;
  /** Header above the rest when `preferred` is set. Default: 'All countries' */
  allCountriesLabel?: string;
}

export interface CountryFlagProps {
  code: CountryCode;
}

/** Server search props don't apply: the country list is built in. */
type ServerSearchProp =
  | 'options'
  | 'loadOptions'
  | 'onSearchChange'
  | 'searchDebounce'
  | 'onEndReached'
  | 'loading'
  | 'loadingText'
  | 'searchPrompt'
  | 'renderLoading'
  | 'isEqual';

export type CountryPickerProps = DistributiveOmit<SelectPickerProps<CountryCode>, ServerSearchProp> & CountryListOptions;
