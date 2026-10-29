import { useRef } from 'react';
import type { GestureResponderHandlers, LayoutChangeEvent } from 'react-native';
import { PanResponder } from 'react-native';

import type { TrackPanOptions } from '../core.types';
import { toFraction } from '../utils/track.utils';

/** Tap or drag on a slider's track or a pad: `onStart` and `onMove` get where, 0–1 across and down, and `onEnd` the release. */
export const useTrackPan = (options: TrackPanOptions) => {
  const size = useRef({ width: 0, height: 0 });
  const start = useRef({ x: 0, y: 0 });
  // The responder is created once, so it reads the latest callbacks through a ref.
  const latest = useRef(options);
  latest.current = options;
  const at = (x: number, y: number): [number, number] => {
    const inset = latest.current.insetX ?? 0;
    return [toFraction(x - inset, size.current.width - 2 * inset), toFraction(y, size.current.height)];
  };
  const end = () => latest.current.onEnd?.();

  const panHandlers: GestureResponderHandlers = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      // A sheet's swipe to close mustn't take over a drag on the track.
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e) => {
        start.current = { x: e.nativeEvent.locationX, y: e.nativeEvent.locationY };
        const { onStart = latest.current.onMove } = latest.current;
        onStart(...at(start.current.x, start.current.y));
      },
      onPanResponderMove: (_, g) => latest.current.onMove(...at(start.current.x + g.dx, start.current.y + g.dy)),
      onPanResponderRelease: end,
      onPanResponderTerminate: end,
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
