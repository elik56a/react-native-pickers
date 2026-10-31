import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { usePickerTheme } from '@elik56a/react-native-pickers';

interface DemoButtonProps {
  title: string;
  onPress: () => void;
  /** `primary`: filled, `secondary`: tinted, `text`: no background, for a sheet header. Default: 'primary' */
  variant?: 'primary' | 'secondary' | 'text';
  disabled?: boolean;
}

/** The examples' button, in the pickers' theme, so it follows dark mode and your primary colour. */
export const DemoButton = ({ title, onPress, variant = 'primary', disabled = false }: DemoButtonProps) => {
  const { colors, radius, typography } = usePickerTheme();
  const [hovered, setHovered] = useState(false);
  const background = { primary: colors.primary, secondary: colors.primaryMuted, text: 'transparent' }[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      disabled={disabled}
      style={({ pressed }) => [
        variant === 'text' ? styles.textButton : styles.button,
        { backgroundColor: background, borderRadius: radius.md, opacity: disabled ? 0.4 : pressed ? 0.7 : hovered ? 0.85 : 1 },
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: variant === 'primary' ? colors.onPrimary : colors.primary, fontFamily: typography.fontFamilyMedium },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: { paddingVertical: 12, paddingHorizontal: 20, alignItems: 'center' },
  textButton: { paddingVertical: 6, paddingHorizontal: 8, alignItems: 'center' },
  label: { fontSize: 16, fontWeight: '600' },
});
