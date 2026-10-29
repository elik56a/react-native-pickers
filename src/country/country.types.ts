import type { StyleProp, ViewStyle } from 'react-native';

import type { Locale, PickerTheme, SlotStyles, ThemableProps } from '../core';
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

export interface PhoneFormat {
  /** Digits as `#`, e.g. '(###) ###-####' */
  pattern: string;
  /** Digits after the calling code */
  min: number;
  max: number;
}

export interface ParsedPhone {
  /** The country the number belongs to, or undefined when no calling code matches */
  country?: CountryCode;
  /** The digits after the calling code */
  nationalNumber: string;
}

export interface PhoneDetails {
  country: CountryCode;
  /** The digits after the calling code, e.g. '541234567' */
  nationalNumber: string;
  /** Whether it has as many digits as the country's numbers do */
  valid: boolean;
}

export type PhoneFieldSlot = 'label' | 'field' | 'input' | 'countryButton' | 'dialCode' | 'chevron';

export interface PhoneFieldProps extends ThemableProps, Omit<CountryListOptions, 'showDialCode'> {
  /** The number in E.164, e.g. '+972541234567'; '' when empty */
  value?: string;
  defaultValue?: string;
  /** Called as the user types or changes country, with the E.164 number */
  onChange?: (value: string, details: PhoneDetails) => void;
  /** The country whose code is used. A `value` with another calling code shows its own country */
  country?: CountryCode;
  /** Default: 'US' */
  defaultCountry?: CountryCode;
  onCountryChange?: (country: CountryCode) => void;
  /** Above the field, or on its border in Material. Screen readers hear 'Phone number' without one */
  label?: string;
  /** Default: an example in the country's format, e.g. '(123) 456-7890' */
  placeholder?: string;
  disabled?: boolean;
  /** Where the country list opens. Default: 'auto' (dropdown on the web, bottom sheet on native) */
  presentation?: CountryPickerProps['presentation'];
  /** Title of the country sheet. Default: 'Country code' */
  countrySheetTitle?: string;
  /** Options for the country sheet, as `CountryPicker`'s `sheet` */
  sheet?: CountryPickerProps['sheet'];
  style?: StyleProp<ViewStyle>;
  styles?: SlotStyles<PhoneFieldSlot>;
  /** On the text input; the country button gets `${testID}-country` */
  testID?: string;
}

export interface CountryButtonProps {
  country: Country;
  open: () => void;
  /** The country list is open */
  picking: boolean;
  disabled: boolean;
  theme: PickerTheme;
  slots?: SlotStyles<PhoneFieldSlot>;
  testID?: string;
}
