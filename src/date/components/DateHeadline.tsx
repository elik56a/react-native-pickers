import { Text, View } from 'react-native';

import { textStyle } from '../../core';
import { coreStyles } from '../../core/core.styles';
import { HEADLINE_FONT_SIZE } from '../date.constants';
import { styles } from '../date.styles';
import type { DateHeadlineProps } from '../date.types';

/** The picked date in large type, above a Material calendar. */
export const DateHeadline = ({ text, theme }: DateHeadlineProps) => (
  <View
    style={[
      styles.headline,
      { borderBottomColor: theme.colors.border, paddingHorizontal: theme.spacing.sm, paddingBottom: theme.spacing.md },
    ]}
  >
    <Text style={[textStyle(theme, 'xl'), coreStyles.startAligned, { fontSize: HEADLINE_FONT_SIZE }]} accessibilityRole="header">
      {text}
    </Text>
  </View>
);
