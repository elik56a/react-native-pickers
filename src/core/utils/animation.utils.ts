import { Animated } from 'react-native';

import { EASE_OUT, USE_NATIVE_DRIVER } from '../core.constants';
import type { SpringOptions, TimingOptions } from '../core.types';

/** `Animated.timing` with the library's defaults: ease-out, and the native driver wherever it exists. Call `.start()` on it. */
export const timing = (
  value: Animated.Value,
  toValue: number,
  { duration, easing = EASE_OUT, delay, native = USE_NATIVE_DRIVER }: TimingOptions
) =>
  Animated.timing(value, {
    toValue,
    duration,
    easing,
    delay,
    useNativeDriver: native,
  });

/** `Animated.spring` with the native driver wherever it exists. Call `.start()` on it. */
export const spring = (value: Animated.Value, toValue: number, { bounciness, speed, native = USE_NATIVE_DRIVER }: SpringOptions = {}) =>
  Animated.spring(value, {
    toValue,
    bounciness,
    speed,
    useNativeDriver: native,
  });
