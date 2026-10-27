import { Animated, View } from 'react-native';

import { useAnimatedToggle } from '../../core/hooks/useAnimatedToggle';
import { FIELD_ARROW, FIELD_DESIGN } from '../sheet.constants';
import { styles } from '../sheet.styles';
import type { ChevronProps } from '../sheet.types';

/** A drawn chevron (a rotated corner, so no SVG dependency), or a filled triangle in Material, that flips up while the field is open; `renderChevron` swaps the icon, not the flip. */
export const Chevron = ({ open, renderChevron, theme, style }: ChevronProps) => {
  const progress = useAnimatedToggle(open, theme.animation.duration);
  const rotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const color = open ? theme.colors.primary : theme.colors.textSecondary;
  const triangle = FIELD_DESIGN[theme.design].arrow === FIELD_ARROW.triangle;

  return (
    <Animated.View pointerEvents="none" style={[styles.chevron, { transform: [{ rotate }] }]}>
      {renderChevron ? (
        renderChevron({ open, theme })
      ) : (
        <View
          style={[triangle ? [styles.chevronTriangle, { borderTopColor: color }] : [styles.chevronMark, { borderColor: color }], style]}
        />
      )}
    </Animated.View>
  );
};
