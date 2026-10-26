import { useEffect, useRef, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { Animated } from 'react-native';

import { SEGMENTED_PADDING } from '../demo.constants';

/** Springs the highlight pill of a segmented control under its active segment. */
export const useSlidingPill = (activeIndex: number, segments: number) => {
  const offset = useRef(new Animated.Value(0)).current;
  const [width, setWidth] = useState(0);

  useEffect(() => {
    Animated.spring(offset, { toValue: activeIndex * width, useNativeDriver: false, speed: 14, bounciness: 7 }).start();
  }, [activeIndex, offset, width]);

  const onLayout = (e: LayoutChangeEvent) => setWidth((e.nativeEvent.layout.width - SEGMENTED_PADDING * 2) / segments);

  return {
    offset,
    width,
    onLayout,
  };
};
