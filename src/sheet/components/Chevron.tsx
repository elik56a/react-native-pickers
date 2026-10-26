import { Animated, View } from 'react-native';

import { useAnimatedToggle } from '../../core/hooks/useAnimatedToggle';
import { styles } from '../sheet.styles';
import type { ChevronProps } from '../sheet.types';

/** A drawn chevron (a rotated corner, so no SVG dependency) that flips up while the field is open; `renderChevron` swaps the icon, not the flip. */
export const Chevron = ({ open, renderChevron, theme, style }: ChevronProps) => {
  const progress = useAnimatedToggle(open, theme.animation.duration);
  const rotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  return (
    <Animated.View pointerEvents="none" style={[styles.chevron, { transform: [{ rotate }] }]}>
      {renderChevron ? (
        renderChevron({ open, theme })
      ) : (
        <View style={[styles.chevronMark, { borderColor: open ? theme.colors.primary : theme.colors.textSecondary }, style]} />
      )}
    </Animated.View>
  );
};
