import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

/** Sheets size against the browser window; inside the mock device they must stop at its screen, which animates between devices. */
export const useScreenHeight = (frameRef: RefObject<HTMLDivElement | null>) => {
  const [height, setHeight] = useState<number>();
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const observer = new ResizeObserver(() => setHeight(frame.clientHeight));
    observer.observe(frame);
    return () => observer.disconnect();
  }, [frameRef]);
  return height;
};
