import { SelectPicker } from '../select';
import { withSheetHeight } from '../select/select.utils';
import { DEFAULT_CURRENCY_PLACEHOLDER, DEFAULT_CURRENCY_SEARCH_PLACEHOLDER } from './currency.constants';
import type { CurrencyCode, CurrencyPickerProps } from './currency.types';
import { useCurrencyOptions } from './hooks/useCurrencyOptions';

/** A searchable currency list: each currency by name, with its code and symbol, found by any of them. */
export const CurrencyPicker = ({
  currencies,
  exclude,
  preferred,
  locale,
  showFlag,
  preferredLabel,
  allCurrenciesLabel,
  placeholder = DEFAULT_CURRENCY_PLACEHOLDER,
  searchPlaceholder = DEFAULT_CURRENCY_SEARCH_PLACEHOLDER,
  sheet,
  ...selectProps
}: CurrencyPickerProps) => {
  const options = useCurrencyOptions({
    currencies,
    exclude,
    preferred,
    locale,
    showFlag,
    preferredLabel,
    allCurrenciesLabel,
  });
  return (
    <SelectPicker<CurrencyCode>
      {...selectProps}
      options={options}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      sheet={withSheetHeight(sheet)}
    />
  );
};
