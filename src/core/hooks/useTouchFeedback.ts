import { useCallback, useRef, useState } from 'react';
import type { GestureResponderEvent, HostInstance } from 'react-native';
import { Easing } from 'react-native';

import { PRESS_FEEDBACK, PRESS_FEEDBACK_DESIGN, RIPPLE_FADE_RATIO, RIPPLE_GROW_RATIO, RIPPLE_MIN_VISIBLE_RATIO } from '../core.constants';
import type { RippleOrigin, TouchFeedbackState } from '../core.types';
import type { PickerTheme } from '../theme/theme.types';
import { timing } from '../utils/animation.utils';
import { getRippleOrigin } from '../utils/touch.utils';
import { useAnimatedValue } from './useAnimatedValue';

/**
 * Hover and press state for a pressable: a ripple, or a dim while held, as the theme's design does it. `ref` goes on the view the effects cover (the ripple is measured against it),
 * `handlers` on the Pressable, and `feedback` on a <TouchFeedback /> inside that view.
 */
export const useTouchFeedback = (theme: PickerTheme, disabled = false, feedbackEnabled = true): TouchFeedbackState => {
  const ref = useRef<HostInstance>(null);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const highlight = PRESS_FEEDBACK_DESIGN[theme.design] === PRESS_FEEDBACK.highlight;
  const [ripple, setRipple] = useState<RippleOrigin | null>(null);
  const scale = useAnimatedValue(0);
  const opacity = useAnimatedValue(0);
  const pressing = useRef(false);
  const grownAt = useRef(0);
  const duration = theme.animation.duration;
  const growDuration = duration * RIPPLE_GROW_RATIO;

  const fadeOut = useCallback(() => {
    const delay = Math.max(0, growDuration * RIPPLE_MIN_VISIBLE_RATIO - (Date.now() - grownAt.current));
    timing(opacity, 0, { duration: duration * RIPPLE_FADE_RATIO, delay }).start();
  }, [duration, growDuration, opacity]);

  const onPressIn = useCallback(
    (e: GestureResponderEvent) => {
      if (disabled || !feedbackEnabled) return;
      if (highlight) {
        setPressed(true);
        return;
      }
      pressing.current = true;
      const { pageX, pageY } = e.nativeEvent;
      ref.current?.measure((_x, _y, width, height, left, top) => {
        setRipple(getRippleOrigin(pageX - left, pageY - top, width, height));
        scale.setValue(0);
        opacity.setValue(1);
        grownAt.current = Date.now();
        timing(scale, 1, { duration: growDuration, easing: Easing.out(Easing.quad) }).start();
        // A quick tap can lift before the measurement arrives; fade right away so the ripple doesn't stick.
        if (!pressing.current) fadeOut();
      });
    },
    [disabled, fadeOut, feedbackEnabled, growDuration, highlight, opacity, scale]
  );

  const onPressOut = useCallback(() => {
    setPressed(false);
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
      pressed: pressed && !disabled,
      ripple,
      scale,
      opacity,
      theme,
    },
  };
};
