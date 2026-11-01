import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { usePickerTheme } from '@elik56a/react-native-pickers';

interface DemoButtonProps {
  title: string;
  onPress: () => void;
  /** `primary`: filled, `secondary`: tinted, `text`: no background, for a sheet header. Default: 'primary' */
  variant?: 'primary' | 'secondary' | 'text';
  /** `sm`: a compact pill, `icon`: a round button for a one-glyph `title` such as ⋯. Default: 'md' */
  size?: 'md' | 'sm' | 'icon';
  /** What a screen reader says instead of `title`; needed when `size` is 'icon'. */
  accessibilityLabel?: string;
  disabled?: boolean;
}

/** The examples' button, in the pickers' theme, so it follows dark mode and your primary colour. */
export const DemoButton = ({ title, onPress, variant = 'primary', size = 'md', accessibilityLabel, disabled = false }: DemoButtonProps) => {
  const { colors, radius, typography } = usePickerTheme();
  const [hovered, setHovered] = useState(false);
  const background = { primary: colors.primary, secondary: colors.primaryMuted, text: 'transparent' }[variant];
  const box = variant === 'text' ? styles.textButton : styles[size];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      disabled={disabled}
      style={({ pressed }) => [
        box,
        {
          backgroundColor: background,
          borderRadius: size === 'md' ? radius.md : 999,
          opacity: disabled ? 0.4 : pressed ? 0.7 : hovered ? 0.85 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          size !== 'md' && styles[`${size}Label`],
          { color: variant === 'primary' ? colors.onPrimary : colors.primary, fontFamily: typography.fontFamilyMedium },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  md: { paddingVertical: 12, paddingHorizontal: 20, alignItems: 'center' },
  sm: { paddingVertical: 6, paddingHorizontal: 14, alignItems: 'center', alignSelf: 'flex-start' },
  icon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  textButton: { paddingVertical: 6, paddingHorizontal: 8, alignItems: 'center' },
  label: { fontSize: 16, fontWeight: '600' },
  smLabel: { fontSize: 14 },
  iconLabel: { fontSize: 20, lineHeight: 22 },
});
