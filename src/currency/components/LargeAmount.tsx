import { TextInput, View } from 'react-native';

import { PickerText } from '../../core/components/PickerText';
import { coreStyles } from '../../core/core.styles';
import { FieldMessage } from '../../sheet/components/FieldMessage';
import { DISABLED_TRIGGER_OPACITY, REQUIRED_MARK } from '../../sheet/sheet.constants';
import { styles } from '../currency.styles';
import type { AmountLayoutProps } from '../currency.types';
import { AmountText } from './AmountText';

/** The amount big and centered, as send-money and checkout screens show it, with the currency pill and message under it. */
export const LargeAmount = ({
  amount,
  inputProps,
  currencyPicker,
  label,
  placeholder,
  error,
  helperText,
  required,
  disabled,
  theme,
  slots,
  style,
}: AmountLayoutProps) => (
  <View style={[{ opacity: disabled ? DISABLED_TRIGGER_OPACITY : 1 }, style]}>
    {label ? (
      <PickerText theme={theme} size="sm" color="textSecondary" style={[styles.largeLabel, slots?.label]}>
        {label}
        {required && REQUIRED_MARK}
      </PickerText>
    ) : null}
    <View style={styles.amountRow}>
      <AmountText
        text={amount.text}
        placeholder={placeholder}
        symbol={amount.currency.symbol}
        symbolPosition={amount.symbolPosition}
        focused={amount.focused}
        caretOpacity={amount.caretOpacity}
        theme={theme}
        slots={slots}
      />
      <TextInput {...inputProps} style={[coreStyles.hiddenInput, coreStyles.noOutline]} />
    </View>
    {currencyPicker}
    <FieldMessage error={error} helperText={helperText} centered theme={theme} style={slots?.helperText} />
  </View>
);
