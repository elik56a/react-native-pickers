import { View } from 'react-native';

import { PickerText } from '../../core/components/PickerText';
import { coreStyles } from '../../core/core.styles';
import { styles } from '../select.styles';
import type { GroupHeaderProps } from '../select.types';

export const GroupHeader = ({ group, renderGroupHeader, theme, slots }: GroupHeaderProps) => {
  if (renderGroupHeader) return renderGroupHeader(group, theme);
  return (
    <View
      style={[{ paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md, paddingBottom: theme.spacing.xs }, slots?.groupHeader]}
    >
      <PickerText
        theme={theme}
        size="xs"
        weight="bold"
        color="textSecondary"
        style={[coreStyles.startAligned, styles.groupHeaderText, slots?.groupHeaderText]}
      >
        {group}
      </PickerText>
    </View>
  );
};
