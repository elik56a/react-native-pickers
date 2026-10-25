import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

import { OPEN_EXTRA_DURATION_MS, USE_NATIVE_DRIVER } from '../sheet.constants';
import type { SheetAnimationOptions } from '../sheet.types';

/** Slides the sheet in when `visible` turns on and unmounts it after sliding out; `drag` offsets it while swiping. */
export const useSheetAnimation = ({ visible, duration, slideDistance, onOpened, onClosed }: SheetAnimationOptions) => {
  const [mounted, setMounted] = useState(visible);
  const progress = useRef(new Animated.Value(0)).current;
  const drag = useRef(new Animated.Value(0)).current;
  const wasVisible = useRef(false);
  const callbacks = useRef({ onOpened, onClosed });
  callbacks.current = { onOpened, onClosed };

  useEffect(() => {
    if (visible) {
      setMounted(true);
      drag.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: duration + OPEN_EXTRA_DURATION_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start(({ finished }) => {
        if (finished) callbacks.current.onOpened?.();
      });
    } else if (wasVisible.current) {
      Animated.timing(progress, {
        toValue: 0,
        duration,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start(({ finished }) => {
        if (!finished) return;
        setMounted(false);
        callbacks.current.onClosed?.();
      });
    }
    wasVisible.current = visible;
  }, [drag, duration, progress, visible]);

  const translateY = useMemo(
    () => Animated.add(progress.interpolate({ inputRange: [0, 1], outputRange: [slideDistance, 0] }), drag),
    [drag, progress, slideDistance]
  );

  return {
    mounted,
    progress,
    drag,
    translateY,
  };
};
