import { ActivityIndicator, Text, View } from 'react-native';

import { textStyle } from '../../core';
import { styles } from '../select.styles';
import type { LoadingStateProps } from '../select.types';

export const LoadingState = ({ text, renderLoading, theme, slots }: LoadingStateProps) => (
  <View style={[styles.loading, { padding: theme.spacing.lg, gap: theme.spacing.sm }, slots?.loading]} accessibilityRole="progressbar">
    {renderLoading ? (
      renderLoading(theme)
    ) : (
      <>
        <ActivityIndicator color={theme.colors.primary} />
        <Text style={[textStyle(theme, 'sm'), { color: theme.colors.textSecondary }, slots?.loadingText]}>{text}</Text>
      </>
    )}
  </View>
);
