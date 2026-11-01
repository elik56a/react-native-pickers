import { useRef } from 'react';
import type { GestureResponderHandlers } from 'react-native';
import { PanResponder } from 'react-native';

import type { DragOptions } from '../core.types';
import { isHorizontalSwipe, isVerticalSwipe } from '../utils/swipe.utils';

/** A drag that's clearly sideways, or up or down with `vertical`, leaving taps and other drags to what's under it. */
export const useDrag = (options: DragOptions): GestureResponderHandlers => {
  // The responder is created once, so it reads the latest callbacks through a ref.
  const latest = useRef(options);
  latest.current = options;
  return useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => (latest.current.vertical ? isVerticalSwipe(g.dx, g.dy) : isHorizontalSwipe(g.dx, g.dy)),
      onPanResponderGrant: () => latest.current.onStart?.(),
      onPanResponderMove: (_, g) => latest.current.onMove?.(g),
      onPanResponderRelease: (_, g) => latest.current.onEnd?.(g),
      onPanResponderTerminate: () => latest.current.onCancel?.(),
    })
  ).current.panHandlers;
};
