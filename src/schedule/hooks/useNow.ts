import { useEffect, useState } from 'react';

import { MINUTE_MS } from '../schedule.constants';

/** The current time, moved on at the start of every minute while `enabled`. */
export const useNow = (enabled: boolean) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!enabled) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    const tick = () => setNow(new Date());
    const timeout = setTimeout(
      () => {
        tick();
        interval = setInterval(tick, MINUTE_MS);
      },
      MINUTE_MS - (Date.now() % MINUTE_MS)
    );
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [enabled]);

  return now;
};
