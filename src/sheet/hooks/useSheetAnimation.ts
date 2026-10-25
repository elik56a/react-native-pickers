import { useEffect, useMemo } from 'react';
import { Animated } from 'react-native';

import { useAnimatedValue } from '../../core/hooks/useAnimatedValue';
import { usePresence } from '../../core/hooks/usePresence';
import { OPEN_EXTRA_DURATION_MS } from '../sheet.constants';
import type { SheetAnimationOptions } from '../sheet.types';

/** Slides the sheet in when `visible` turns on and unmounts it after sliding out; `drag` offsets it while swiping. */
export const useSheetAnimation = ({ visible, duration, slideDistance, onOpened, onClosed }: SheetAnimationOptions) => {
  const { mounted, progress } = usePresence({
    visible,
    duration,
    enterDuration: duration + OPEN_EXTRA_DURATION_MS,
    onShown: onOpened,
    onHidden: onClosed,
  });
  const drag = useAnimatedValue(0);

  useEffect(() => {
    if (visible) drag.setValue(0);
  }, [drag, visible]);

  const translateY = useMemo(
    () => Animated.add(progress.interpolate({ inputRange: [0, 1], outputRange: [slideDistance, 0] }), drag),
    [drag, progress, slideDistance]
  );

  return {
    mounted,
    progress,
    drag,
    translateY,
  };
};
