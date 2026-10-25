import { Text } from 'react-native';

import { textStyle } from '../../core';
import { Touchable } from '../../core/components/Touchable';
import { BUTTON_HIT_SLOP } from '../sheet.constants';
import { styles } from '../sheet.styles';
import type { SheetButtonProps } from '../sheet.types';

export const SheetButton = ({ label, onPress, primary = false, disabled, theme }: SheetButtonProps) => {
  const c = theme.colors;
  return (
    <Touchable
      theme={theme}
      onPress={onPress}
      disabled={disabled}
      hitSlop={BUTTON_HIT_SLOP}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={[styles.button, { borderRadius: theme.radius.sm }]}
    >
      <Text
        style={[
          textStyle(theme, 'md', primary ? 'bold' : 'regular'),
          { color: disabled ? c.textDisabled : primary ? c.primary : c.textSecondary },
        ]}
      >
        {label}
      </Text>
    </Touchable>
  );
};
