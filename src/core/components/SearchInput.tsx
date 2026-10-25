import { StyleSheet, TextInput } from 'react-native';

import { coreStyles } from '../core.styles';
import type { SearchInputProps } from '../core.types';
import { useFocus } from '../hooks/useFocus';
import { textStyle } from '../theme/theme.utils';

export const SearchInput = ({ value, onChangeText, placeholder, autoFocus, theme, style }: SearchInputProps) => {
  const { focused, onFocus, onBlur } = useFocus();
  return (
    <TextInput
      onFocus={onFocus}
      onBlur={onBlur}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={theme.colors.textSecondary}
      autoFocus={autoFocus}
      autoCorrect={false}
      autoCapitalize="none"
      clearButtonMode="while-editing"
      accessibilityLabel={placeholder}
      style={[
        textStyle(theme, 'md'),
        styles.input,
        coreStyles.noOutline,
        {
          backgroundColor: theme.colors.surface,
          borderColor: focused ? theme.colors.primary : 'transparent',
          borderRadius: theme.radius.md,
          paddingHorizontal: theme.spacing.md,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  input: { height: 42, borderWidth: 1.5 },
});
