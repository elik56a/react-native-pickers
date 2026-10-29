import { useEffect, useMemo } from 'react';

import { useAnimatedValue } from '../../core/hooks/useAnimatedValue';
import { timing } from '../../core/utils/animation.utils';
import { HALO_LEVEL, HALO_OPACITY, HALO_SCALE } from '../slider.constants';
import type { HaloLevel, HaloStyle } from '../slider.types';

const LEVELS = Object.values(HALO_LEVEL);

/** The halo's fade and size, animating between none, hover and pressed. */
export const useHaloStyle = (level: HaloLevel, duration: number): HaloStyle => {
  const progress = useAnimatedValue(level);
  useEffect(() => {
    timing(progress, level, { duration }).start();
  }, [duration, level, progress]);
  return useMemo<HaloStyle>(
    () => ({
      opacity: progress.interpolate({ inputRange: LEVELS, outputRange: HALO_OPACITY }),
      transform: [{ scale: progress.interpolate({ inputRange: LEVELS, outputRange: HALO_SCALE }) }],
    }),
    [progress]
  );
};
