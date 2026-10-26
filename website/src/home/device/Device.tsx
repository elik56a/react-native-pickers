import { useRef, useState } from 'react';

import clsx from 'clsx';

import { PlatformTabs } from './components/PlatformTabs';
import { SideButtons } from './components/SideButtons';
import { TopBar } from './components/TopBar';
import { PLATFORM } from './device.constants';
import styles from './device.module.css';
import type { Platform, RenderScreen } from './device.types';
import { usePortalsInside } from './hooks/usePortalsInside';
import { useScreenHeight } from './hooks/useScreenHeight';

/** An iPhone, Pixel or browser window, switched with the tabs above it. */
export const Device = ({ children }: { children: RenderScreen }) => {
  const [platform, setPlatform] = useState<Platform>(PLATFORM.ios);
  const frameRef = useRef<HTMLDivElement>(null);
  const screenHeight = useScreenHeight(frameRef, platform);
  usePortalsInside(frameRef, platform !== PLATFORM.web);
  return (
    <div className={clsx(styles.device, platform === PLATFORM.web && styles.deviceWide)}>
      <PlatformTabs value={platform} onChange={setPlatform} />
      <div
        className={clsx(styles.hardware, platform === PLATFORM.ios && styles.titanium, platform === PLATFORM.android && styles.aluminum)}
      >
        <SideButtons platform={platform} />
        <div ref={frameRef} className={clsx(styles.frame, styles[platform])}>
          <TopBar platform={platform} />
          <div className={styles.screen}>{children(platform, screenHeight)}</div>
          {platform !== PLATFORM.web && <span className={styles.homeIndicator} aria-hidden />}
        </div>
      </div>
    </div>
  );
};
