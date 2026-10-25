import { Text, View } from 'react-native';

import { textStyle } from '../../core';
import { coreStyles } from '../../core/core.styles';
import { styles } from '../select.styles';
import type { GroupHeaderProps } from '../select.types';

export const GroupHeader = ({ group, renderGroupHeader, theme, slots }: GroupHeaderProps) => {
  if (renderGroupHeader) return renderGroupHeader(group, theme);
  return (
    <View
      style={[{ paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md, paddingBottom: theme.spacing.xs }, slots?.groupHeader]}
    >
      <Text
        style={[
          textStyle(theme, 'xs', 'bold'),
          coreStyles.startAligned,
          styles.groupHeaderText,
          { color: theme.colors.textSecondary },
          slots?.groupHeaderText,
        ]}
      >
        {group}
      </Text>
    </View>
  );
};
