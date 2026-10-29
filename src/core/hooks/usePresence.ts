import { useEffect, useRef, useState } from 'react';

import { EASE_IN } from '../core.constants';
import type { Presence, PresenceOptions } from '../core.types';
import { timing } from '../utils/animation.utils';
import { useAnimatedValue } from './useAnimatedValue';

/** Mounts when `visible` turns on and animates `progress` in; on hide it animates out first and unmounts after. */
export const usePresence = ({ visible, duration, enterDuration = duration, native, onShown, onHidden }: PresenceOptions): Presence => {
  const [mounted, setMounted] = useState(visible);
  const progress = useAnimatedValue(0);
  const wasVisible = useRef(false);
  const callbacks = useRef({ onShown, onHidden });
  callbacks.current = { onShown, onHidden };

  useEffect(() => {
    if (visible) {
      setMounted(true);
      timing(progress, 1, { duration: enterDuration, native }).start(({ finished }) => {
        if (finished) callbacks.current.onShown?.();
      });
    } else if (wasVisible.current) {
      timing(progress, 0, { duration, easing: EASE_IN, native }).start(({ finished }) => {
        if (!finished) return;
        setMounted(false);
        callbacks.current.onHidden?.();
      });
    }
    wasVisible.current = visible;
  }, [duration, enterDuration, native, progress, visible]);

  return {
    mounted,
    progress,
  };
};
