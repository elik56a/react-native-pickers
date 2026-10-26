import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

import type { DemoTab } from '../../playground/playground.types';
import { TAB_FADE_MS } from '../demo.constants';

/** Fades and lifts the screen body in on every tab switch. */
export const useTabFade = (tab: DemoTab) => {
  const fade = useRef(new Animated.Value(1)).current;

  // biome-ignore lint/correctness/useExhaustiveDependencies: replays the fade on every tab switch
  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: TAB_FADE_MS, useNativeDriver: false }).start();
  }, [fade, tab]);

  return {
    opacity: fade,
    transform: [{ translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
  };
};
