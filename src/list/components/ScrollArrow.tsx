import { Text, View } from 'react-native';

import { textStyle } from '../../core';
import { Touchable } from '../../core/components/Touchable';
import { SCROLL_ARROW_GLYPHS, SCROLL_ARROW_LABELS, SCROLL_ARROW_SIDE } from '../list.constants';
import { styles } from '../list.styles';
import type { ScrollArrowProps } from '../list.types';

export const ScrollArrow = ({ side, disabled, overlay, renderArrow, onPress, theme, slots, testID }: ScrollArrowProps) => {
  const button = (
    <Touchable
      theme={theme}
      disabled={disabled}
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={SCROLL_ARROW_LABELS[side]}
      accessibilityState={{ disabled }}
      style={[
        styles.arrow,
        { backgroundColor: theme.colors.background, borderColor: theme.colors.border, borderRadius: theme.radius.full },
        slots?.arrow,
      ]}
      testID={testID}
    >
      {renderArrow ? (
        renderArrow(side, disabled)
      ) : (
        <Text
          style={[
            textStyle(theme, 'lg', 'bold'),
            styles.arrowText,
            { color: disabled ? theme.colors.textDisabled : theme.colors.text },
            slots?.arrowText,
          ]}
        >
          {SCROLL_ARROW_GLYPHS[side]}
        </Text>
      )}
    </Touchable>
  );
  if (!overlay) return button;
  return (
    <View
      pointerEvents="box-none"
      style={[styles.arrowSlot, side === SCROLL_ARROW_SIDE.left ? styles.arrowSlotLeft : styles.arrowSlotRight]}
    >
      {button}
    </View>
  );
};
