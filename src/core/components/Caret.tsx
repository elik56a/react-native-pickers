import { Animated } from 'react-native';

import { CARET_HEIGHT_RATIO } from '../core.constants';
import { coreStyles } from '../core.styles';
import type { CaretProps } from '../core.types';

/** A text caret for text a component draws itself, sized to its font and blinking by `opacity` (from `useCaretBlink`). */
export const Caret = ({ fontSize, opacity, theme, style }: CaretProps) => (
  <Animated.View
    style={[coreStyles.caret, { height: fontSize * CARET_HEIGHT_RATIO, backgroundColor: theme.colors.primary, opacity }, style]}
  />
);
