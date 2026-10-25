import { View } from 'react-native';
import { styles } from '../wheel.styles';
import type { WheelIndicatorProps } from '../wheel.types';

export const WheelIndicator = ({ itemHeight, theme, style, renderIndicator }: WheelIndicatorProps) => (
  <View pointerEvents="none" style={styles.centerOverlay}>
    {renderIndicator ? (
      renderIndicator(theme)
    ) : (
      <View
        style={[
          {
            height: itemHeight,
            borderRadius: theme.radius.md,
            backgroundColor: theme.colors.indicator,
            marginHorizontal: theme.spacing.xs,
          },
          style,
        ]}
      />
    )}
  </View>
);
