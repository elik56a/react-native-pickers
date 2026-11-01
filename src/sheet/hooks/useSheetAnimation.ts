import { useMemo } from 'react';

import { usePresence } from '../../core/hooks/usePresence';
import { OPEN_EXTRA_DURATION_MS } from '../sheet.constants';
import type { SheetAnimation, SheetAnimationOptions } from '../sheet.types';

/** Slides the sheet in when `visible` turns on and unmounts it after sliding out. */
export const useSheetAnimation = ({ visible, duration, slideDistance, onOpened, onClosed }: SheetAnimationOptions): SheetAnimation => {
  const { mounted, progress } = usePresence({
    visible,
    duration,
    enterDuration: duration + OPEN_EXTRA_DURATION_MS,
    onShown: onOpened,
    onHidden: onClosed,
  });
  const slide = useMemo(() => progress.interpolate({ inputRange: [0, 1], outputRange: [slideDistance, 0] }), [progress, slideDistance]);

  return {
    mounted,
    progress,
    slide,
  };
};
