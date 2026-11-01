import type { RefObject } from 'react';
import { useEffect } from 'react';

import { REDUCED_MOTION_QUERY } from '../../home.constants';
import { HERO_MAX_TILT } from '../hero.constants';

/** Leans the stage toward the pointer: sets --tilt-x and --tilt-y on `ref`, in degrees, once a frame at most, and back to flat when it leaves. */
export const usePointerTilt = (ref: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia(REDUCED_MOTION_QUERY).matches) return;
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = el.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - 0.5;
        const y = (event.clientY - box.top) / box.height - 0.5;
        el.style.setProperty('--tilt-x', `${(-y * HERO_MAX_TILT).toFixed(2)}deg`);
        el.style.setProperty('--tilt-y', `${(x * HERO_MAX_TILT * 2).toFixed(2)}deg`);
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      el.style.setProperty('--tilt-x', '0deg');
      el.style.setProperty('--tilt-y', '0deg');
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [ref]);
};
