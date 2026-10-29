import { Text, View } from 'react-native';

import { textStyle } from '../../core';
import { styles } from '../action.styles';
import type { ActionSheetHeaderProps } from '../action.types';

export const ActionSheetHeader = ({ title, message, grouped, theme, slots }: ActionSheetHeaderProps) => {
  if (!title && !message) return null;
  const c = theme.colors;
  const align = grouped && styles.centered;
  return (
    <View
      style={[
        styles.header,
        grouped && styles.groupedHeader,
        { paddingHorizontal: theme.spacing.lg, paddingVertical: grouped ? theme.spacing.md : theme.spacing.sm },
        slots?.header,
      ]}
    >
      {title ? (
        <Text
          style={[textStyle(theme, grouped ? 'sm' : 'md', 'bold'), { color: grouped ? c.textSecondary : c.text }, align, slots?.title]}
          accessibilityRole="header"
        >
          {title}
        </Text>
      ) : null}
      {message ? <Text style={[textStyle(theme, 'sm'), { color: c.textSecondary }, align, slots?.message]}>{message}</Text> : null}
    </View>
  );
};
