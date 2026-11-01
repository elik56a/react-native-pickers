import type React from 'react';
import type { Animated, StyleProp, TextInputProps, ViewStyle } from 'react-native';

import type { Locale, PickerTheme, SlotStyles, ThemableProps } from '../core';
import type { ValueOf } from '../core/core.types';
import type { BuiltInSelectPickerProps } from '../select/select.types';
import type { FieldStatusProps } from '../sheet/sheet.types';
import type { AMOUNT_VARIANT, SYMBOL_POSITION } from './currency.constants';
import type { CurrencyCode } from './data';

export type { CurrencyCode };

export interface Currency {
  /** ISO 4217, e.g. 'USD' */
  code: CurrencyCode;
  /** English name, e.g. 'US Dollar' */
  name: string;
  /** The narrow symbol, e.g. '$', or the code where there's none, e.g. 'CHF' */
  symbol: string;
  /** Digits after the decimal point: 2 for USD, 0 for JPY, 3 for KWD */
  decimals: number;
  /** The region whose flag stands for it, e.g. 'US' or 'EU'; none for a currency shared by a region without one, such as XOF */
  country?: string;
}

export interface CurrencyListOptions {
  /** Only these currencies. Default: all */
  currencies?: ReadonlyArray<CurrencyCode>;
  /** Leave these out */
  exclude?: ReadonlyArray<CurrencyCode>;
  /** Shown first, in this order, under their own header */
  preferred?: ReadonlyArray<CurrencyCode>;
  /** Language of the currency names, through `Intl.DisplayNames`; English where it's unsupported. Default: the device locale */
  locale?: Locale;
  /** A flag before each currency, such as 🇯🇵 for the yen. Default: true */
  showFlag?: boolean;
  /** Header above `preferred`. Default: 'Suggested' */
  preferredLabel?: string;
  /** Header above the rest when `preferred` is set. Default: 'All currencies' */
  allCurrenciesLabel?: string;
}

export type CurrencyPickerProps = BuiltInSelectPickerProps<CurrencyCode> & CurrencyListOptions;

export type AmountVariant = ValueOf<typeof AMOUNT_VARIANT>;
export type SymbolPosition = ValueOf<typeof SYMBOL_POSITION>;

export type AmountFieldSlot =
  | 'label'
  | 'field'
  | 'input'
  | 'symbol'
  | 'amount'
  | 'caret'
  | 'currencyButton'
  | 'currencyCode'
  | 'chevron'
  | 'helperText';

export interface AmountFieldProps extends ThemableProps, FieldStatusProps, Omit<CurrencyListOptions, 'locale'> {
  /** The amount, e.g. 1234.5; null when empty */
  value?: number | null;
  defaultValue?: number | null;
  /** Called as the user types, with the amount or null */
  onChange?: (value: number | null) => void;
  /** The currency: its symbol, decimal places and flag */
  currency?: CurrencyCode;
  /** Default: 'USD' */
  defaultCurrency?: CurrencyCode;
  onCurrencyChange?: (currency: CurrencyCode) => void;
  /** A button with the currency's flag and code that opens a searchable `CurrencyPicker`. Default: false */
  showCurrencyPicker?: boolean;
  /** 'field', the form field, or 'large': a big centered amount for checkout, tip and send-money screens. Default: 'field' */
  variant?: AmountVariant;
  /** Separators and currency names. Default: the device locale */
  locale?: Locale;
  /** Above the field, on its border in Material, or over a large amount. Screen readers hear 'Amount' without one */
  label?: string;
  /** Default: zero in the currency's format, e.g. '0.00' */
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  /** Where the currency list opens. Default: 'auto' (dropdown on the web, bottom sheet on native) */
  presentation?: CurrencyPickerProps['presentation'];
  /** Title of the currency sheet. Default: 'Currency' */
  currencySheetTitle?: string;
  /** Options for the currency sheet, as `CurrencyPicker`'s `sheet` */
  sheet?: CurrencyPickerProps['sheet'];
  style?: StyleProp<ViewStyle>;
  styles?: SlotStyles<AmountFieldSlot>;
  /** On the text input; the currency button gets `${testID}-currency` */
  testID?: string;
}

export interface NumberSeparators {
  group: string;
  decimal: string;
}

export interface AmountFormat {
  decimals: number;
  separators: NumberSeparators;
  locale?: Locale;
}

/** What the field shows and the amount it stands for: '1,234.' is 1234 */
export interface AmountInput {
  text: string;
  value: number | null;
}

export interface CurrencyButtonProps {
  currency: Currency;
  open: () => void;
  /** The currency list is open */
  picking: boolean;
  disabled: boolean;
  /** A pill under a large amount, rather than the start of a field */
  pill: boolean;
  theme: PickerTheme;
  slots?: SlotStyles<AmountFieldSlot>;
  testID?: string;
}

export interface AmountTextProps {
  text: string;
  placeholder: string;
  symbol: string;
  symbolPosition: SymbolPosition;
  /** Shows the caret after the amount */
  focused: boolean;
  caretOpacity: Animated.Value;
  theme: PickerTheme;
  slots?: SlotStyles<AmountFieldSlot>;
}

export interface AmountFieldState {
  currency: Currency;
  symbolPosition: SymbolPosition;
  /** As typed, e.g. '1,234.' */
  text: string;
  /** Zero in the currency's format, e.g. '0.00' */
  placeholder: string;
  changeText: (typed: string) => void;
  changeCurrency: (next: CurrencyCode) => void;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  caretOpacity: Animated.Value;
  /** The currency list is open */
  picking: boolean;
  openPicker: () => void;
  closePicker: () => void;
}

/** What AmountField hands the layout it draws, the form field or the large amount. */
export interface AmountLayoutProps extends FieldStatusProps {
  amount: AmountFieldState;
  /** The text input's props; each layout adds its look */
  inputProps: TextInputProps;
  /** The currency button and its list, when `showCurrencyPicker` is on */
  currencyPicker: React.ReactNode;
  label?: string;
  placeholder: string;
  disabled: boolean;
  theme: PickerTheme;
  slots?: SlotStyles<AmountFieldSlot>;
  style?: StyleProp<ViewStyle>;
}
