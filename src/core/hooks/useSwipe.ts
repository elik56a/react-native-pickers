import { useRef } from 'react';
import type { GestureResponderHandlers } from 'react-native';
import { I18nManager, PanResponder } from 'react-native';

import { getSwipeDelta, isHorizontalSwipe } from '../utils/swipe.utils';

/** Swipe left for `go(1)` and right for `go(-1)`, mirrored in RTL. */
export const useSwipe = (go: (delta: number) => void): GestureResponderHandlers => {
  // The responder is created once, so it reads the latest `go` through a ref.
  const goRef = useRef(go);
  goRef.current = go;
  return useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => isHorizontalSwipe(g.dx, g.dy),
      onPanResponderRelease: (_, g) => {
        const delta = getSwipeDelta(g.dx, g.vx, !!I18nManager.isRTL);
        if (delta) goRef.current(delta);
      },
    })
  ).current.panHandlers;
};
