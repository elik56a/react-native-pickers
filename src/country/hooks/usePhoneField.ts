import { useState } from 'react';

import { useControllableState } from '../../core/hooks/useControllableState';
import { DEFAULT_PHONE_COUNTRY } from '../country.constants';
import type { CountryCode, PhoneFieldProps } from '../country.types';
import { formatNationalNumber, isValidPhone, parsePhone, toE164, toNationalNumber } from '../country.utils';

/** The country and number a phone field shows, and the handlers that turn typing and country picks into E.164. */
export const usePhoneField = ({
  value: valueProp,
  defaultValue = '',
  onChange,
  country: countryProp,
  defaultCountry = DEFAULT_PHONE_COUNTRY,
  onCountryChange,
}: PhoneFieldProps) => {
  const [value, setValue] = useControllableState(valueProp, defaultValue);
  const [chosen, setChosen] = useControllableState(countryProp, defaultCountry, onCountryChange);
  const [picking, setPicking] = useState(false);
  const parsed = value ? parsePhone(value, chosen) : null;
  // A number with another calling code shows its own country.
  const country = parsed?.country ?? chosen;
  const nationalNumber = parsed?.nationalNumber ?? '';
  const text = formatNationalNumber(nationalNumber, country);

  const emit = (national: string, code: CountryCode) => {
    const next = toE164(national, code);
    setValue(next);
    onChange?.(next, {
      country: code,
      nationalNumber: national,
      valid: isValidPhone(national, code),
    });
  };

  const changeText = (typed: string) => {
    if (typed.trim().startsWith('+')) {
      const pasted = parsePhone(typed, country);
      if (!pasted.country) return;
      if (pasted.country !== chosen) setChosen(pasted.country);
      emit(toNationalNumber(pasted.nationalNumber, pasted.country), pasted.country);
      return;
    }
    emit(toNationalNumber(typed, country), country);
  };

  const changeCountry = (code: CountryCode) => {
    setChosen(code);
    if (nationalNumber) emit(nationalNumber, code);
  };

  return {
    country,
    text,
    changeText,
    changeCountry,
    picking,
    openPicker: () => setPicking(true),
    closePicker: () => setPicking(false),
  };
};
