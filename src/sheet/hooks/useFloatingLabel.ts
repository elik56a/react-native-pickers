import { useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';

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

  return {
    onBoxLayout: (e: LayoutChangeEvent) => setBoxHeight(e.nativeEvent.layout.height),
    onTextLayout: (e: LayoutChangeEvent) => setTextWidth(e.nativeEvent.layout.width),
    transform: [
      { translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, shift.x] }) },
      { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [0, shift.y] }) },
      { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [1, scale] }) },
    ],
  };
};
