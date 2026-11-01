import { SelectPicker } from '../select';
import { withSheetHeight } from '../select/select.utils';
import { DEFAULT_COUNTRY_PLACEHOLDER, DEFAULT_COUNTRY_SEARCH_PLACEHOLDER } from './country.constants';
import type { CountryCode, CountryPickerProps } from './country.types';
import { useCountryOptions } from './hooks/useCountryOptions';

export const CountryPicker = ({
  countries,
  exclude,
  preferred,
  locale,
  showDialCode,
  preferredLabel,
  allCountriesLabel,
  placeholder = DEFAULT_COUNTRY_PLACEHOLDER,
  searchPlaceholder = DEFAULT_COUNTRY_SEARCH_PLACEHOLDER,
  sheet,
  ...selectProps
}: CountryPickerProps) => {
  const options = useCountryOptions({
    countries,
    exclude,
    preferred,
    locale,
    showDialCode,
    preferredLabel,
    allCountriesLabel,
  });
  return (
    <SelectPicker<CountryCode>
      {...selectProps}
      options={options}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      sheet={withSheetHeight(sheet)}
    />
  );
};
