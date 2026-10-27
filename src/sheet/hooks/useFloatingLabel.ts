import { useState } from 'react';
import type { Animated, LayoutChangeEvent } from 'react-native';

import { useAnimatedToggle } from '../../core/hooks/useAnimatedToggle';
import type { PickerTheme } from '../../core/theme/theme.types';
import { FLOATING_LABEL_RAISED_SIZE } from '../sheet.constants';
import { getFloatingLabelShift } from '../sheet.utils';

/** Measures the field and the label, and animates the label between resting inside the field and raised onto its border. */
export const useFloatingLabel = (raised: boolean, borderWidth: number, theme: PickerTheme) => {
  const [boxHeight, setBoxHeight] = useState(0);
  const [textWidth, setTextWidth] = useState(0);
  const progress = useAnimatedToggle(raised, theme.animation.duration);
  const { sizes } = theme.typography;
  const scale = sizes[FLOATING_LABEL_RAISED_SIZE] / sizes.md;
  const shift = getFloatingLabelShift(boxHeight, textWidth, scale, borderWidth);
  // Typed with the public Animated type so the emitted .d.ts doesn't reach into react-native's internal files.
  const toward = (to: number, from = 0): Animated.AnimatedInterpolation<number> =>
    progress.interpolate({ inputRange: [0, 1], outputRange: [from, to] });

  return {
    onBoxLayout: (e: LayoutChangeEvent) => setBoxHeight(e.nativeEvent.layout.height),
    onTextLayout: (e: LayoutChangeEvent) => setTextWidth(e.nativeEvent.layout.width),
    transform: [{ translateX: toward(shift.x) }, { translateY: toward(shift.y) }, { scale: toward(scale, 1) }],
  };
};
