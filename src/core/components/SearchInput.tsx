import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { HOVER_FILL_SPREAD, PLATFORM, SEARCH_DESIGN, SEARCH_ICON_SIZE } from '../core.constants';
import { coreStyles } from '../core.styles';
import type { SearchInputProps } from '../core.types';
import { useFocus } from '../hooks/useFocus';
import { usePickerPlatform } from '../theme/ThemeProvider';
import { textStyle } from '../theme/theme.utils';
import { SEARCH_FIELD_ARROWS } from '../utils/keyboard.utils';
import { SearchIcon } from './SearchIcon';

/** A search field drawn as the design's own: the iOS search bar, Material's pill, or an outlined web input. */
export const SearchInput = ({ value, onChangeText, placeholder, autoFocus, theme, style, containerStyle }: SearchInputProps) => {
  const { focused, onFocus, onBlur } = useFocus();
  const [hovered, setHovered] = useState(false);
  const platform = usePickerPlatform();
  const design = SEARCH_DESIGN[theme.design];
  const ring = focused && (design.focusRing || platform === PLATFORM.web);
  const iconStart = theme.spacing[design.iconInset];
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        onFocus={onFocus}
        onBlur={onBlur}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        autoFocus={autoFocus}
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
        accessibilityLabel={placeholder}
        {...SEARCH_FIELD_ARROWS}
        style={[
          textStyle(theme, 'md'),
          styles.input,
          coreStyles.noOutline,
          {
            height: design.height,
            backgroundColor: design.outlined ? theme.colors.background : theme.colors.surface,
            borderColor: ring ? theme.colors.primary : design.outlined ? theme.colors.border : 'transparent',
            borderRadius: theme.radius[design.radius],
            paddingStart: iconStart + SEARCH_ICON_SIZE + theme.spacing.sm,
            paddingEnd: theme.spacing.md,
            boxShadow: ring
              ? `0 0 0 1px ${theme.colors.primary}`
              : hovered && !focused
                ? `inset 0 0 0 ${HOVER_FILL_SPREAD}px ${theme.colors.hover}`
                : undefined,
          },
          style,
        ]}
      />
      <View pointerEvents="none" style={[styles.icon, { start: iconStart }]}>
        <SearchIcon color={theme.colors.textSecondary} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { justifyContent: 'center' },
  input: { borderWidth: 1 },
  icon: { position: 'absolute' },
});
