import { useEffect, useState } from 'react';

import { DEVICE_SWAP_OUT_MS } from '../device.constants';
import type { Platform } from '../device.types';

/** Keeps showing the old device while it fades out, then swaps in the new one, which fades in. */
export const useDeviceSwap = (platform: Platform) => {
  const [shown, setShown] = useState(platform);
  useEffect(() => {
    if (platform === shown) return;
    const id = setTimeout(() => setShown(platform), DEVICE_SWAP_OUT_MS);
    return () => clearTimeout(id);
  }, [platform, shown]);
  return {
    shown,
    leaving: platform !== shown,
  };
};
