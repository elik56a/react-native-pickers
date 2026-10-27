import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

import { useAnimatedValue } from '../../core/hooks/useAnimatedValue';
import { timing } from '../../core/utils/animation.utils';
import { getNearestAngle } from '../time.utils';

/** The hand's rotation: it turns the short way to a tapped number, and follows the finger without lag while dragging. */
export const useDialHand = (angle: number, dragging: RefObject<boolean>, duration: number) => {
  const rotation = useAnimatedValue(angle);
  const shown = useRef(angle);
  useEffect(() => {
    const target = getNearestAngle(shown.current, angle);
    shown.current = target;
    if (dragging.current) rotation.setValue(target);
    else timing(rotation, target, { duration }).start();
  }, [angle, dragging, duration, rotation]);
  return rotation.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'], extrapolate: 'extend' });
};
