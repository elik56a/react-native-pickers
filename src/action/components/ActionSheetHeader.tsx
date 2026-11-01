import { View } from 'react-native';

import { PickerText } from '../../core/components/PickerText';
import { styles } from '../action.styles';
import type { ActionSheetHeaderProps } from '../action.types';

export const ActionSheetHeader = ({ title, message, grouped, theme, slots }: ActionSheetHeaderProps) => {
  if (!title && !message) return null;
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
        <PickerText
          theme={theme}
          size={grouped ? 'sm' : 'md'}
          weight="bold"
          color={grouped ? 'textSecondary' : 'text'}
          style={[align, slots?.title]}
          accessibilityRole="header"
        >
          {title}
        </PickerText>
      ) : null}
      {message ? (
        <PickerText theme={theme} size="sm" color="textSecondary" style={[align, slots?.message]}>
          {message}
        </PickerText>
      ) : null}
    </View>
  );
};
