import { Text, View } from 'react-native';

import { textStyle } from '../../core';
import { SHEET_DESIGN, TITLE_ALIGN } from '../sheet.constants';
import { styles } from '../sheet.styles';
import type { SheetHeaderProps } from '../sheet.types';

export const SheetHeader = ({ title, headerLeft, headerRight, theme, slots }: SheetHeaderProps) => {
  const start = SHEET_DESIGN[theme.design].titleAlign === TITLE_ALIGN.start;
  return (
    <View style={[styles.header, { paddingHorizontal: theme.spacing.lg }, slots?.header]}>
      {start && !headerLeft ? null : <View style={styles.headerSide}>{headerLeft}</View>}
      <View style={[styles.headerCenter, start && styles.headerStart]}>
        {typeof title === 'string' ? (
          <Text style={[textStyle(theme, start ? 'lg' : 'md', 'bold'), slots?.title]} numberOfLines={1} accessibilityRole="header">
            {title}
          </Text>
        ) : (
          title
        )}
      </View>
      <View style={[styles.headerSide, styles.headerRight]}>{headerRight}</View>
    </View>
  );
};
