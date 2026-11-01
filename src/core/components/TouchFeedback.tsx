import { Animated, StyleSheet, View } from 'react-native';

import { coreStyles } from '../core.styles';
import type { TouchFeedbackProps } from '../core.types';

/** The hover tint and press ripple, drawn behind the content of the view it's placed in. */
export const TouchFeedback = ({ hovered, pressed, ripple, scale, opacity, theme, borderRadius }: TouchFeedbackProps) => (
  <View pointerEvents="none" style={[StyleSheet.absoluteFill, coreStyles.clip, { borderRadius }]}>
    {hovered && <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.hover }]} />}
    {pressed && <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.ripple }]} />}
    {ripple && (
      <Animated.View
        style={[
          coreStyles.ripple,
          {
            left: ripple.x - ripple.radius,
            top: ripple.y - ripple.radius,
            width: ripple.radius * 2,
            height: ripple.radius * 2,
            borderRadius: ripple.radius,
            backgroundColor: theme.colors.ripple,
            opacity,
            transform: [{ scale }],
          },
        ]}
      />
    )}
  </View>
);
