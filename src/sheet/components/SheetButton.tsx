import { PickerText } from '../../core/components/PickerText';
import { Touchable } from '../../core/components/Touchable';
import { BUTTON_HIT_SLOP } from '../sheet.constants';
import { styles } from '../sheet.styles';
import type { SheetButtonProps } from '../sheet.types';

export const SheetButton = ({ label, onPress, primary = false, disabled, theme }: SheetButtonProps) => {
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
      <PickerText
        theme={theme}
        weight={primary ? 'bold' : 'regular'}
        color={disabled ? 'textDisabled' : primary ? 'primary' : 'textSecondary'}
      >
        {label}
      </PickerText>
    </Touchable>
  );
};
