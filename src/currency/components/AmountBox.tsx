import { TextInput, View } from 'react-native';

import { textStyle } from '../../core';
import { PickerText } from '../../core/components/PickerText';
import { coreStyles } from '../../core/core.styles';
import { FieldFrame } from '../../sheet/components/FieldFrame';
import { FloatingLabel } from '../../sheet/components/FloatingLabel';
import { FIELD_DESIGN, FIELD_LABEL } from '../../sheet/sheet.constants';
import { styles as sheetStyles } from '../../sheet/sheet.styles';
import { getFieldBorderWidth, getFieldBoxStyle } from '../../sheet/sheet.utils';
import { SYMBOL_POSITION } from '../currency.constants';
import { styles } from '../currency.styles';
import type { AmountLayoutProps } from '../currency.types';

/** The amount as a form field: the currency button, the symbol and the number, in the design's field box. */
export const AmountBox = ({
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
}: AmountLayoutProps) => {
  const active = amount.focused || amount.picking;
  const invalid = !!error;
  const floating = !!label && FIELD_DESIGN[theme.design].label === FIELD_LABEL.floating;
  // A Material label rests inside the empty field, so the symbol and hint wait until it rises, as Material's prefix does.
  const raised = !floating || active || !!amount.text || !!currencyPicker;
  const symbol = raised && (
    <PickerText theme={theme} color="textSecondary" style={slots?.symbol}>
      {amount.currency.symbol}
    </PickerText>
  );

  return (
    <View style={style}>
      <FieldFrame label={label} error={error} helperText={helperText} required={required} theme={theme} slots={slots}>
        <View style={[sheetStyles.trigger, getFieldBoxStyle(theme, { open: active, invalid, disabled }), slots?.field]}>
          {floating ? (
            <FloatingLabel
              label={label}
              raised={raised}
              open={active}
              invalid={invalid}
              required={required}
              borderWidth={getFieldBorderWidth(theme, active)}
              theme={theme}
              style={slots?.label}
            />
          ) : null}
          <View style={styles.row}>
            {currencyPicker}
            {amount.symbolPosition === SYMBOL_POSITION.before && symbol}
            <TextInput
              {...inputProps}
              placeholder={raised ? placeholder : undefined}
              placeholderTextColor={theme.colors.textSecondary}
              style={[textStyle(theme, 'md'), styles.input, coreStyles.noOutline, { color: theme.colors.text }, slots?.input]}
            />
            {amount.symbolPosition === SYMBOL_POSITION.after && symbol}
          </View>
        </View>
      </FieldFrame>
    </View>
  );
};
