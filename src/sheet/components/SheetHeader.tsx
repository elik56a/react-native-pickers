import { Text, View } from 'react-native';

import { textStyle } from '../../core';
import { styles } from '../sheet.styles';
import type { SheetHeaderProps } from '../sheet.types';

export const SheetHeader = ({ title, headerLeft, headerRight, theme, slots }: SheetHeaderProps) => (
  <View style={[styles.header, { paddingHorizontal: theme.spacing.lg }, slots?.header]}>
    <View style={styles.headerSide}>{headerLeft}</View>
    <View style={styles.headerCenter}>
      {typeof title === 'string' ? (
        <Text style={[textStyle(theme, 'md', 'bold'), slots?.title]} numberOfLines={1} accessibilityRole="header">
          {title}
        </Text>
      ) : (
        title
      )}
    </View>
    <View style={[styles.headerSide, styles.headerRight]}>{headerRight}</View>
  </View>
);
