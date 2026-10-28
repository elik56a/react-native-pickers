import { useRef, useState } from 'react';

import clsx from 'clsx';

import { PlatformRail } from './components/PlatformRail';
import { SideButtons } from './components/SideButtons';
import { TopBar } from './components/TopBar';
import { PLATFORM } from './device.constants';
import styles from './device.module.css';
import type { Platform, RenderScreen } from './device.types';
import { useDeviceSwap } from './hooks/useDeviceSwap';
import { usePortalsInside } from './hooks/usePortalsInside';
import { useScreenHeight } from './hooks/useScreenHeight';

interface DeviceProps {
  children: RenderScreen;
  /** Controls the tabs from outside, e.g. a docs example that renders its preview through the platform. */
  platform?: Platform;
  onPlatformChange?: (platform: Platform) => void;
  /** Shows the iOS / Android / Web rail beside the device. Default: true */
  rail?: boolean;
}

/** An iPhone, Pixel or browser window, switched with the rail beside it: the body morphs while the screen crossfades. */
export const Device = ({ children, platform: platformProp, onPlatformChange, rail = true }: DeviceProps) => {
  const [ownPlatform, setOwnPlatform] = useState<Platform>(PLATFORM.ios);
  const platform = platformProp ?? ownPlatform;
  const setPlatform = onPlatformChange ?? setOwnPlatform;
  const { shown, leaving } = useDeviceSwap(platform);
  const frameRef = useRef<HTMLDivElement>(null);
  const screenHeight = useScreenHeight(frameRef);
  usePortalsInside(frameRef, shown !== PLATFORM.web);
  return (
    <div className={clsx(styles.device, platform === PLATFORM.web && styles.deviceWide)} data-platform={platform}>
      {rail ? <PlatformRail value={platform} onChange={setPlatform} /> : null}
      <div className={styles.slot}>
        <div
          className={clsx(
            styles.hardware,
            platform === PLATFORM.ios && styles.titanium,
            platform === PLATFORM.android && styles.aluminum,
            leaving && styles.leaving
          )}
        >
          <SideButtons key={platform} platform={platform} />
          <div ref={frameRef} className={clsx(styles.frame, styles[platform])}>
            <div className={styles.content}>
              <TopBar platform={shown} />
              <div className={styles.screen}>{children(shown, screenHeight)}</div>
              {shown !== PLATFORM.web && <span className={styles.homeIndicator} aria-hidden />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
