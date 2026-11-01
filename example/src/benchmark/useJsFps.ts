import { useEffect, useState } from 'react';

import { FPS_WINDOW_MS, LOG_TAG } from './benchmark.constants';

/** JS frames per second, from requestAnimationFrame, logged each second for `adb logcat`. */
export const useJsFps = (label: string) => {
  const [fps, setFps] = useState(0);
  useEffect(() => {
    let frames = 0;
    let start = Date.now();
    let raf = requestAnimationFrame(function tick() {
      frames += 1;
      const now = Date.now();
      if (now - start >= FPS_WINDOW_MS) {
        const value = Math.round((frames * 1000) / (now - start));
        console.log(`${LOG_TAG} jsFps=${value} ${label}`);
        setFps(value);
        frames = 0;
        start = now;
      }
      raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [label]);
  return fps;
};
