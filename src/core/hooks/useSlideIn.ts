import { useCallback, useMemo } from 'react';
import type { Animated } from 'react-native';
import { I18nManager } from 'react-native';

import { SLIDE_DISTANCE } from '../core.constants';
import type { SlideStyle } from '../core.types';
import { timing } from '../utils/animation.utils';
import { useAnimatedValue } from './useAnimatedValue';

/** A page that fades and slides in from the side it came from: `from(1)` for the next page, `from(-1)` for the previous one. */
export const useSlideIn = (animationDuration: number) => {
  const slide: Animated.Value = useAnimatedValue(0);

  const from = useCallback(
    (delta: number) => {
      slide.setValue(delta * (I18nManager.isRTL ? -1 : 1));
      timing(slide, 0, { duration: animationDuration }).start();
    },
    [animationDuration, slide]
  );

  const style = useMemo<SlideStyle>(
    () => ({
      opacity: slide.interpolate({ inputRange: [-1, 0, 1], outputRange: [0, 1, 0] }),
      transform: [{ translateX: slide.interpolate({ inputRange: [-1, 0, 1], outputRange: [-SLIDE_DISTANCE, 0, SLIDE_DISTANCE] }) }],
    }),
    [slide]
  );

  return {
    style,
    from,
  };
};
