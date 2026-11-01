import { useMemo } from 'react';

import { CountryFlag } from '../../country/components/CountryFlag';
import type { LanguageListOptions } from '../language.types';
import { buildLanguageOptions, getLanguage } from '../language.utils';

/** The language options, with a flag before each unless `showFlag` is false, rebuilt only when a list option changes. */
export const useLanguageOptions = ({
  languages,
  exclude,
  preferred,
  locale,
  showFlag = true,
  flags,
  preferredLabel,
  allLanguagesLabel,
}: LanguageListOptions) =>
  useMemo(() => {
    const options = buildLanguageOptions({
      languages,
      exclude,
      preferred,
      locale,
      preferredLabel,
      allLanguagesLabel,
    });
    if (!showFlag) return options;
    return options.map((option) => {
      const country = flags?.[option.value] ?? getLanguage(option.value)?.country;
      return {
        ...option,
        icon: country ? <CountryFlag code={country} /> : undefined,
      };
    });
  }, [languages, exclude, preferred, locale, showFlag, flags, preferredLabel, allLanguagesLabel]);
