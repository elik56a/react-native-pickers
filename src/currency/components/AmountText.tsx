import { View } from 'react-native';

import { Caret } from '../../core/components/Caret';
import { PickerText } from '../../core/components/PickerText';
import { LARGE_AMOUNT_LINE_HEIGHT, LARGE_AMOUNT_WEIGHT, SYMBOL_POSITION } from '../currency.constants';
import { styles } from '../currency.styles';
import type { AmountTextProps } from '../currency.types';
import { getLargeAmountFontSize } from '../currency.utils';

/** A large amount with its symbol, shrinking as it grows so it stays on one line, and a caret after it while typing. */
export const AmountText = ({ text, placeholder, symbol, symbolPosition, focused, caretOpacity, theme, slots }: AmountTextProps) => {
  const shown = text || placeholder;
  const fontSize = getLargeAmountFontSize(shown.length + symbol.length);
  const size = { fontSize, lineHeight: fontSize * LARGE_AMOUNT_LINE_HEIGHT };
  const weight = LARGE_AMOUNT_WEIGHT[theme.design];
  const color = text ? 'text' : 'textSecondary';
  const symbolText = (
    <PickerText theme={theme} weight={weight} color={color} style={[size, slots?.symbol]}>
      {symbolPosition === SYMBOL_POSITION.after ? ` ${symbol}` : symbol}
    </PickerText>
  );

  return (
    <View style={styles.amountRow} pointerEvents="none">
      {symbolPosition === SYMBOL_POSITION.before && symbolText}
      <PickerText theme={theme} weight={weight} color={color} style={[size, slots?.amount]}>
        {shown}
      </PickerText>
      {focused && <Caret fontSize={fontSize} opacity={caretOpacity} theme={theme} style={slots?.caret} />}
      {symbolPosition === SYMBOL_POSITION.after && symbolText}
    </View>
  );
};
