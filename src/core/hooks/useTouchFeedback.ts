import { useCallback, useRef, useState } from 'react';
import type { GestureResponderEvent, HostInstance } from 'react-native';
import { Animated, Easing } from 'react-native';

import { RIPPLE_FADE_RATIO, RIPPLE_GROW_RATIO, RIPPLE_MIN_VISIBLE_RATIO, USE_NATIVE_DRIVER } from '../core.constants';
import type { RippleOrigin, TouchFeedbackState } from '../core.types';
import type { PickerTheme } from '../theme/theme.types';
import { getRippleOrigin } from '../utils/touch.utils';

/**
 * Hover and ripple state for a pressable. `ref` goes on the view the effects cover (the ripple is measured against it),
 * `handlers` on the Pressable, and `feedback` on a <TouchFeedback /> inside that view.
 */
export const useTouchFeedback = (theme: PickerTheme, disabled = false, rippleEnabled = true): TouchFeedbackState => {
  const ref = useRef<HostInstance>(null);
  const [hovered, setHovered] = useState(false);
  const [ripple, setRipple] = useState<RippleOrigin | null>(null);
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const pressing = useRef(false);
  const grownAt = useRef(0);
  const duration = theme.animation.duration;
  const growDuration = duration * RIPPLE_GROW_RATIO;

  const fadeOut = useCallback(() => {
    const delay = Math.max(0, growDuration * RIPPLE_MIN_VISIBLE_RATIO - (Date.now() - grownAt.current));
    Animated.timing(opacity, {
      toValue: 0,
      delay,
      duration: duration * RIPPLE_FADE_RATIO,
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
  }, [duration, growDuration, opacity]);

  const onPressIn = useCallback(
    (e: GestureResponderEvent) => {
      if (disabled || !rippleEnabled) return;
      pressing.current = true;
      const { pageX, pageY } = e.nativeEvent;
      ref.current?.measure((_x, _y, width, height, left, top) => {
        setRipple(getRippleOrigin(pageX - left, pageY - top, width, height));
        scale.setValue(0);
        opacity.setValue(1);
        grownAt.current = Date.now();
        Animated.timing(scale, {
          toValue: 1,
          duration: growDuration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: USE_NATIVE_DRIVER,
        }).start();
        // A quick tap can lift before the measurement arrives; fade right away so the ripple doesn't stick.
        if (!pressing.current) fadeOut();
      });
    },
    [disabled, fadeOut, growDuration, opacity, rippleEnabled, scale]
  );

  const onPressOut = useCallback(() => {
    pressing.current = false;
    fadeOut();
  }, [fadeOut]);

  const onHoverIn = useCallback(() => setHovered(true), []);
  const onHoverOut = useCallback(() => setHovered(false), []);

  return {
    ref,
    handlers: {
      onPressIn,
      onPressOut,
      onHoverIn,
      onHoverOut,
    },
    feedback: {
      hovered: hovered && !disabled,
      ripple,
      scale,
      opacity,
      theme,
    },
  };
};
