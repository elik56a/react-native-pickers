import { useCallback, useMemo, useRef } from 'react';
import type { GestureResponderHandlers, LayoutChangeEvent } from 'react-native';
import { Animated, PanResponder } from 'react-native';

import { SNAP_BACK_BOUNCINESS, USE_NATIVE_DRIVER } from '../sheet.constants';
import { isSwipeDown, shouldDismiss } from '../sheet.utils';

/** Drags the sheet down with the finger; closes past the threshold, otherwise springs back. */
export const useSwipeToClose = (drag: Animated.Value, enabled: boolean, onClose: () => void) => {
  const sheetHeight = useRef(Number.POSITIVE_INFINITY);
  const latest = useRef({ enabled, onClose });
  latest.current = { enabled, onClose };

  const panHandlers = useMemo((): GestureResponderHandlers => {
    const snapBack = (bounciness?: number) => Animated.spring(drag, { toValue: 0, useNativeDriver: USE_NATIVE_DRIVER, bounciness }).start();
    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => latest.current.enabled && isSwipeDown(g.dx, g.dy),
      onPanResponderMove: (_, g) => drag.setValue(Math.max(0, g.dy)),
      onPanResponderRelease: (_, g) => {
        if (shouldDismiss(g.dy, g.vy, sheetHeight.current)) latest.current.onClose();
        else snapBack(SNAP_BACK_BOUNCINESS);
      },
      onPanResponderTerminate: () => snapBack(),
    }).panHandlers;
  }, [drag]);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    sheetHeight.current = e.nativeEvent.layout.height;
  }, []);

  return {
    panHandlers,
    onLayout,
  };
};
