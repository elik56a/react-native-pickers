import { Text } from 'react-native';

import { textStyle } from '../../core';
import { Touchable } from '../../core/components/Touchable';
import { coreStyles } from '../../core/core.styles';
import { CREATE_ICON, SELECT_DESIGN } from '../select.constants';
import { styles } from '../select.styles';
import type { CreateRowProps } from '../select.types';

/** The last row while the search matches no option's label: offers the typed text as a new option. */
export const CreateRow = ({ text, label, onCreate, theme, slots }: CreateRowProps) => {
  const look = SELECT_DESIGN[theme.design];
  return (
    <Touchable
      theme={theme}
      onPress={() => onCreate(text)}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        styles.option,
        {
          minHeight: look.rowHeight,
          paddingHorizontal: theme.spacing.lg,
          marginHorizontal: look.insetRows ? theme.spacing.sm : 0,
          borderRadius: look.insetRows ? theme.radius.md : 0,
        },
        slots?.createOption,
      ]}
    >
      <Text style={[textStyle(theme, 'lg', 'medium'), { color: theme.colors.primary, marginEnd: theme.spacing.md }]}>{CREATE_ICON}</Text>
      <Text
        numberOfLines={1}
        style={[
          textStyle(theme, 'md', 'medium'),
          coreStyles.startAligned,
          styles.flex,
          { color: theme.colors.primary },
          slots?.createOptionLabel,
        ]}
      >
        {label}
      </Text>
    </Touchable>
  );
};
