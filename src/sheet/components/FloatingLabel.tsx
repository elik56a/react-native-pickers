import { Animated, StyleSheet, View } from 'react-native';

import { textStyle } from '../../core';
import { useFloatingLabel } from '../hooks/useFloatingLabel';
import { styles } from '../sheet.styles';
import type { FloatingLabelProps } from '../sheet.types';

/** A Material label: inside the empty field like a placeholder, raised onto the border once the field opens or has a value. */
export const FloatingLabel = ({ label, raised, open, borderWidth, theme, style }: FloatingLabelProps) => {
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
          { backgroundColor: c.background, color: open ? c.primary : c.textSecondary, transform: floating.transform },
          style,
        ]}
      >
        {label}
      </Animated.Text>
    </View>
  );
};
