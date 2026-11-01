import { useComponentTheme } from '../core/theme/ThemeProvider';
import { getFieldAccessibility } from '../sheet/sheet.utils';
import { CurrencyPicker } from './CurrencyPicker';
import { AmountBox } from './components/AmountBox';
import { CurrencyButton } from './components/CurrencyButton';
import { LargeAmount } from './components/LargeAmount';
import { AMOUNT_VARIANT, CURRENCY_BUTTON_LABEL, DEFAULT_AMOUNT_LABEL } from './currency.constants';
import type { AmountFieldProps } from './currency.types';
import { useAmountField } from './hooks/useAmountField';

/** A money input: the amount grouped as the user types, in the currency's symbol and decimal places, as a field or large. */
export const AmountField = (props: AmountFieldProps) => {
  const {
    variant = AMOUNT_VARIANT.field,
    showCurrencyPicker = false,
    label,
    placeholder,
    disabled = false,
    autoFocus,
    error,
    helperText,
    required,
    currencies,
    exclude,
    preferred,
    locale,
    showFlag,
    preferredLabel,
    allCurrenciesLabel,
    presentation,
    currencySheetTitle = CURRENCY_BUTTON_LABEL,
    sheet,
    style,
    styles: slots,
    theme: themeProp,
    design,
    testID,
  } = props;
  const { theme, themeOverride } = useComponentTheme(themeProp, design);
  const amount = useAmountField(props);
  const large = variant === AMOUNT_VARIANT.large;

  const currencyPicker = showCurrencyPicker && (
    <CurrencyPicker
      value={amount.currency.code}
      onChange={amount.changeCurrency}
      currencies={currencies}
      exclude={exclude}
      preferred={preferred}
      locale={locale}
      showFlag={showFlag}
      preferredLabel={preferredLabel}
      allCurrenciesLabel={allCurrenciesLabel}
      presentation={presentation}
      sheetTitle={currencySheetTitle}
      sheet={sheet}
      onOpen={amount.openPicker}
      onClose={amount.closePicker}
      disabled={disabled}
      theme={themeOverride}
      renderTrigger={({ open }) => (
        <CurrencyButton
          currency={amount.currency}
          open={open}
          picking={amount.picking}
          disabled={disabled}
          pill={large}
          theme={theme}
          slots={slots}
          testID={testID ? `${testID}-currency` : undefined}
        />
      )}
    />
  );
  const layout = {
    amount,
    inputProps: {
      value: amount.text,
      onChangeText: amount.changeText,
      onFocus: amount.onFocus,
      onBlur: amount.onBlur,
      inputMode: amount.currency.decimals > 0 ? ('decimal' as const) : ('numeric' as const),
      editable: !disabled,
      autoFocus,
      ...getFieldAccessibility({ name: `${label ?? DEFAULT_AMOUNT_LABEL}, ${amount.currency.name}`, error, required }),
      testID,
    },
    currencyPicker,
    label,
    placeholder: placeholder ?? amount.placeholder,
    error,
    helperText,
    required,
    disabled,
    theme,
    slots,
    style,
  };

  if (large) return <LargeAmount {...layout} />;
  return <AmountBox {...layout} />;
};
