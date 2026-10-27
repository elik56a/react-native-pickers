import type { Platform } from './device.types';

export const PLATFORM = {
  ios: 'ios',
  android: 'android',
  web: 'web',
} as const;

export const PLATFORMS = Object.values(PLATFORM);

export const PLATFORM_LABELS: Record<Platform, string> = { ios: 'iOS', android: 'Android', web: 'Web' };

export const STATUS_BAR_TIME = '9:41';

export const BROWSER_URL = 'localhost:8081';

/** Matches the exit transition in device.module.css. */
export const DEVICE_SWAP_OUT_MS = 160;
