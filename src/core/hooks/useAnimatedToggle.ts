import { useEffect } from 'react';
import type { Animated } from 'react-native';

import { timing } from '../utils/animation.utils';
import { useAnimatedValue } from './useAnimatedValue';

/** A value that animates to 1 while `on` and back to 0 when not; it starts where `on` already is. */
export const useAnimatedToggle = (on: boolean, duration: number): Animated.Value => {
  const progress = useAnimatedValue(on ? 1 : 0);
  useEffect(() => {
    timing(progress, on ? 1 : 0, { duration }).start();
  }, [duration, on, progress]);
  return progress;
};
