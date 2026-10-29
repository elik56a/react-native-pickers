import { useEffect } from 'react';
import { Animated } from 'react-native';

import { useAnimatedValue } from '../../core/hooks/useAnimatedValue';
import { timing } from '../../core/utils/animation.utils';
import { CARET_BLINK_MS } from '../otp.constants';

/** The caret's opacity: blinking while `visible`, and shown solid again each time it moves to `position`. */
export const useCaretBlink = (visible: boolean, position: number) => {
  const opacity = useAnimatedValue(1);

  // biome-ignore lint/correctness/useExhaustiveDependencies: restarts when the caret moves, so it shows as soon as a character is typed
  useEffect(() => {
    opacity.setValue(1);
    if (!visible) return;
    const blink = Animated.loop(
      Animated.sequence([
        timing(opacity, 0, { duration: 0, delay: CARET_BLINK_MS }),
        timing(opacity, 1, { duration: 0, delay: CARET_BLINK_MS }),
      ])
    );
    blink.start();
    return () => blink.stop();
  }, [visible, position]);

  return opacity;
};
