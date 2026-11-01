import { SelectPicker } from '../select';
import { withSheetHeight } from '../select/select.utils';
import { useLanguageOptions } from './hooks/useLanguageOptions';
import { DEFAULT_LANGUAGE_PLACEHOLDER, DEFAULT_LANGUAGE_SEARCH_PLACEHOLDER } from './language.constants';
import type { LanguageCode, LanguagePickerProps } from './language.types';

/** A searchable language list: each language under its own name, such as Español, with its name in `locale` below. */
export const LanguagePicker = ({
  languages,
  exclude,
  preferred,
  locale,
  showFlag,
  flags,
  preferredLabel,
  allLanguagesLabel,
  placeholder = DEFAULT_LANGUAGE_PLACEHOLDER,
  searchPlaceholder = DEFAULT_LANGUAGE_SEARCH_PLACEHOLDER,
  sheet,
  ...selectProps
}: LanguagePickerProps) => {
  const options = useLanguageOptions({
    languages,
    exclude,
    preferred,
    locale,
    showFlag,
    flags,
    preferredLabel,
    allLanguagesLabel,
  });
  return (
    <SelectPicker<LanguageCode>
      {...selectProps}
      options={options}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      sheet={withSheetHeight(sheet)}
    />
  );
};
