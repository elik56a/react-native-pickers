import { ActivityIndicator, View } from 'react-native';

import { PickerText } from '../../core/components/PickerText';
import { styles } from '../select.styles';
import type { LoadingStateProps } from '../select.types';

export const LoadingState = ({ text, renderLoading, theme, slots }: LoadingStateProps) => (
  <View style={[styles.loading, { padding: theme.spacing.lg, gap: theme.spacing.sm }, slots?.loading]} accessibilityRole="progressbar">
    {renderLoading ? (
      renderLoading(theme)
    ) : (
      <>
        <ActivityIndicator color={theme.colors.primary} />
        <PickerText theme={theme} size="sm" color="textSecondary" style={slots?.loadingText}>
          {text}
        </PickerText>
      </>
    )}
  </View>
);
