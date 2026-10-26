import { useEffect, useState } from 'react';

import { COUNT_UP_MS } from '../home.constants';
import { easeOutCubic } from '../home.utils';

/** Counts from 0 up to `value`, or shows it straight away for people who prefer reduced motion. */
export const useCountUp = (value: number) => {
  const [shown, setShown] = useState(value);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_UP_MS);
      setShown(Math.round(value * easeOutCubic(t)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return shown;
};
