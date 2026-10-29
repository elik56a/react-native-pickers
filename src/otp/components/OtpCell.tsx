import { Animated, Text, View } from 'react-native';

import { textStyle } from '../../core';
import { FOCUS_RING_WIDTH } from '../../sheet/sheet.constants';
import { CARET_HEIGHT_RATIO } from '../otp.constants';
import { styles } from '../otp.styles';
import type { OtpCellProps } from '../otp.types';

/** One character of the code in a box drawn like the design's text fields, with the caret while it's next to fill. */
export const OtpCell = ({ cell, caretOpacity, look, theme, slots, testID }: OtpCellProps) => {
  const c = theme.colors;
  const borderWidth = cell.focused ? look.openBorderWidth : 1;
  const fontSize = theme.typography.sizes.xl;

  return (
    <View
      style={[
        styles.cell,
        {
          height: look.minHeight,
          backgroundColor: c.background,
          borderWidth,
          borderColor: cell.focused ? c.primary : c[look.outline],
          borderRadius: theme.radius.md,
        },
        cell.focused && look.focusRing && { boxShadow: `0px 0px 0px ${FOCUS_RING_WIDTH}px ${c.primaryMuted}` },
        slots?.cell,
        cell.filled && slots?.filledCell,
        cell.focused && slots?.focusedCell,
      ]}
      testID={testID}
    >
      {cell.caret ? (
        <Animated.View
          style={[styles.caret, { height: fontSize * CARET_HEIGHT_RATIO, backgroundColor: c.primary, opacity: caretOpacity }, slots?.caret]}
        />
      ) : (
        <Text style={[textStyle(theme, 'xl', 'medium'), slots?.cellText]}>{cell.char}</Text>
      )}
    </View>
  );
};
