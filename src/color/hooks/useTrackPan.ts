import { useRef } from 'react';
import type { GestureResponderHandlers, LayoutChangeEvent } from 'react-native';
import { PanResponder } from 'react-native';

import { toFraction } from '../color.utils';

/**
 * Tap or drag on a slider's track or a pad: `onMove` gets where, 0–1 across and down. `insetX` keeps the ends half a
 * thumb in, where a slider's thumb centre stops.
 */
export const useTrackPan = (onMove: (x: number, y: number) => void, insetX = 0) => {
  const size = useRef({ width: 0, height: 0 });
  const start = useRef({ x: 0, y: 0 });
  // The responder is created once, so it reads the latest onMove through a ref.
  const latest = useRef(onMove);
  latest.current = onMove;
  const at = (x: number, y: number) =>
    latest.current(toFraction(x - insetX, size.current.width - 2 * insetX), toFraction(y, size.current.height));

  const panHandlers: GestureResponderHandlers = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      // A sheet's swipe to close mustn't take over a drag on the colour.
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e) => {
        start.current = { x: e.nativeEvent.locationX, y: e.nativeEvent.locationY };
        at(start.current.x, start.current.y);
      },
      onPanResponderMove: (_, g) => at(start.current.x + g.dx, start.current.y + g.dy),
    })
  ).current.panHandlers;

  return {
    panHandlers,
    onLayout: (e: LayoutChangeEvent) => {
      size.current = {
        width: e.nativeEvent.layout.width,
        height: e.nativeEvent.layout.height,
      };
    },
  };
};
