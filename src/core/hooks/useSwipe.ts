import type { GestureResponderHandlers } from 'react-native';
import { I18nManager } from 'react-native';

import { getSwipeDelta } from '../utils/swipe.utils';
import { useDrag } from './useDrag';

/** Swipe left for `go(1)` and right for `go(-1)`, mirrored in RTL. */
export const useSwipe = (go: (delta: number) => void): GestureResponderHandlers =>
  useDrag({
    onEnd: ({ dx, vx }) => {
      const delta = getSwipeDelta(dx, vx, !!I18nManager.isRTL);
      if (delta) go(delta);
    },
  });
