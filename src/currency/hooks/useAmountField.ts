import { useState } from 'react';

import { useCaretBlink } from '../../core/hooks/useCaretBlink';
import { useControllableState } from '../../core/hooks/useControllableState';
import { useFocus } from '../../core/hooks/useFocus';
import { DEFAULT_CURRENCY } from '../currency.constants';
import type { AmountFieldProps, AmountFieldState, AmountInput, CurrencyCode } from '../currency.types';
import {
  formatAmount,
  getAmountPlaceholder,
  getNumberSeparators,
  getSymbolPosition,
  parseAmountInput,
  resolveCurrency,
} from '../currency.utils';

/** The amount and currency a field shows, the text as the user types it, and the handlers for typing, focus and currency picks. */
export const useAmountField = ({
  value: valueProp,
  defaultValue = null,
  onChange,
  currency: currencyProp,
  defaultCurrency = DEFAULT_CURRENCY,
  onCurrencyChange,
  locale,
}: AmountFieldProps): AmountFieldState => {
  const [value, setValue] = useControllableState(valueProp, defaultValue, onChange);
  const [code, setCode] = useControllableState(currencyProp, defaultCurrency, onCurrencyChange);
  const currency = resolveCurrency(code);
  const format = { decimals: currency.decimals, separators: getNumberSeparators(locale), locale };
  const focus = useFocus();
  const [picking, setPicking] = useState(false);

  // The typed text, kept as typed ('12.' stays '12.'), until a new value or currency comes from outside.
  const [text, setText] = useState(() => formatAmount(value, format));
  const [shown, setShown] = useState(value);
  const [shownCode, setShownCode] = useState(code);
  if (value !== shown || code !== shownCode) {
    setShown(value);
    setShownCode(code);
    setText(formatAmount(value, format));
  }

  const show = (next: AmountInput) => {
    setText(next.text);
    setShown(next.value);
    if (next.value !== value) setValue(next.value);
  };

  return {
    currency,
    symbolPosition: getSymbolPosition(currency.code, locale),
    text,
    placeholder: getAmountPlaceholder(format),
    changeText: (typed: string) => show(parseAmountInput(typed, format)),
    changeCurrency: (next: CurrencyCode) => {
      setCode(next);
      setShownCode(next);
      show(parseAmountInput(text, { ...format, decimals: resolveCurrency(next).decimals }));
    },
    focused: focus.focused,
    onFocus: focus.onFocus,
    // Typing ends: '12.5' settles to '12.50'.
    onBlur: () => {
      focus.onBlur();
      setText(formatAmount(value, format));
    },
    caretOpacity: useCaretBlink(focus.focused, text.length),
    picking,
    openPicker: () => setPicking(true),
    closePicker: () => setPicking(false),
  };
};
