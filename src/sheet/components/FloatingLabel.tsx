import { Animated, StyleSheet, View } from 'react-native';

import { textStyle } from '../../core';
import { useFloatingLabel } from '../hooks/useFloatingLabel';
import { FLOATING_LABEL_PADDING, REQUIRED_MARK } from '../sheet.constants';
import { styles } from '../sheet.styles';
import type { FloatingLabelProps } from '../sheet.types';

/** A Material label: inside the empty field like a placeholder, raised onto the border once the field opens or has a value. */
export const FloatingLabel = ({ label, raised, open, invalid, required, borderWidth, theme, style }: FloatingLabelProps) => {
  const floating = useFloatingLabel(raised, borderWidth, theme);
  const c = theme.colors;
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.floatingLabelBox]} onLayout={floating.onBoxLayout}>
      <Animated.Text
        numberOfLines={1}
        onLayout={floating.onTextLayout}
        style={[
          textStyle(theme, 'md'),
          styles.floatingLabel,
          { backgroundColor: c.background, color: invalid ? c.danger : open ? c.primary : c.textSecondary, transform: floating.transform },
          // Lined up with the field's text, which a thicker open border pushes inward.
          { marginStart: theme.spacing.md - FLOATING_LABEL_PADDING - (borderWidth - 1) },
          style,
        ]}
      >
        {label}
        {required && REQUIRED_MARK}
      </Animated.Text>
    </View>
  );
};
