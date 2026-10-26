import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

import type { Platform } from '../device.types';

/** Sheets size against the browser window; inside the mock device they must stop at its screen. */
export const useScreenHeight = (frameRef: RefObject<HTMLDivElement | null>, platform: Platform) => {
  const [height, setHeight] = useState<number>();
  // biome-ignore lint/correctness/useExhaustiveDependencies: each platform has its own frame, so it's re-measured on switch
  useEffect(() => setHeight(frameRef.current?.clientHeight), [platform]);
  return height;
};
