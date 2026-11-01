import { useMemo } from 'react';

import { CountryFlag } from '../../country/components/CountryFlag';
import type { CurrencyListOptions } from '../currency.types';
import { buildCurrencyOptions, getCurrency } from '../currency.utils';

/** The currency options, with a flag before each unless `showFlag` is false, rebuilt only when a list option changes. */
export const useCurrencyOptions = ({
  currencies,
  exclude,
  preferred,
  locale,
  showFlag = true,
  preferredLabel,
  allCurrenciesLabel,
}: CurrencyListOptions) =>
  useMemo(() => {
    const options = buildCurrencyOptions({
      currencies,
      exclude,
      preferred,
      locale,
      preferredLabel,
      allCurrenciesLabel,
    });
    if (!showFlag) return options;
    return options.map((option) => {
      const country = getCurrency(option.value)?.country;
      return {
        ...option,
        icon: country ? <CountryFlag code={country} /> : undefined,
      };
    });
  }, [currencies, exclude, preferred, locale, showFlag, preferredLabel, allCurrenciesLabel]);
