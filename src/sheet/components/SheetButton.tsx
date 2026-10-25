import { Pressable, Text } from 'react-native';

import { textStyle } from '../../core';
import { BUTTON_HIT_SLOP, PRESSED_BUTTON_OPACITY } from '../sheet.constants';
import { styles } from '../sheet.styles';
import type { SheetButtonProps } from '../sheet.types';

export const SheetButton = ({ label, onPress, primary = false, disabled, theme }: SheetButtonProps) => {
  const c = theme.colors;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={BUTTON_HIT_SLOP}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [styles.button, pressed && { opacity: PRESSED_BUTTON_OPACITY }]}
    >
      <Text
        style={[
          textStyle(theme, 'md', primary ? 'bold' : 'regular'),
          { color: disabled ? c.textDisabled : primary ? c.primary : c.textSecondary },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};
