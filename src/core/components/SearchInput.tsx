import { StyleSheet, TextInput } from 'react-native';

import type { SearchInputProps } from '../core.types';
import { textStyle } from '../theme/theme.utils';

export const SearchInput = ({ value, onChangeText, placeholder, autoFocus, theme, style }: SearchInputProps) => (
  <TextInput
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
      { backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, paddingHorizontal: theme.spacing.md },
      style,
    ]}
  />
);

const styles = StyleSheet.create({
  input: { height: 42 },
});
