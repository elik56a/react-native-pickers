import { TextInput, View } from 'react-native';

import { textStyle } from '../../core';
import { coreStyles } from '../../core/core.styles';
import { SEARCH_FIELD_ARROWS } from '../../core/utils/keyboard.utils';
import { Chevron } from '../../sheet/components/Chevron';
import { styles as sheetStyles } from '../../sheet/sheet.styles';
import { styles } from '../select.styles';
import type { SelectSearchFieldProps } from '../select.types';

/** Stands in for the field while its dropdown is open, so typing filters the options right where the value shows. */
export const SelectSearchField = ({ query, onChangeQuery, placeholder, renderChevron, theme, slots }: SelectSearchFieldProps) => (
  <View
    style={[
      sheetStyles.trigger,
      styles.searchField,
      {
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.primary,
        borderRadius: theme.radius.md,
        paddingHorizontal: theme.spacing.md,
      },
      slots?.trigger,
    ]}
  >
    <TextInput
      value={query}
      onChangeText={onChangeQuery}
      placeholder={placeholder}
      placeholderTextColor={theme.colors.textSecondary}
      autoFocus
      autoCorrect={false}
      autoCapitalize="none"
      accessibilityLabel={placeholder}
      {...SEARCH_FIELD_ARROWS}
      style={[textStyle(theme, 'md'), styles.flex, coreStyles.noOutline, slots?.triggerText]}
    />
    <Chevron open renderChevron={renderChevron} theme={theme} style={slots?.chevron} />
  </View>
);
