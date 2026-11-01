import { useColorMode } from '@docusaurus/theme-common';

import { Device } from '../../device/Device';
import type { Platform } from '../../device/device.types';
import { HERO_STAGGER_MS } from '../hero.constants';
import styles from '../hero.module.css';
import type { HeroPickerProps, HeroWordSpec } from '../hero.types';
import { useDelayedValue } from '../hooks/useDelayedValue';
import { BrowserHeroApp } from './BrowserHeroApp';

interface SpecDeviceProps extends HeroPickerProps {
  spec: HeroWordSpec;
  platform: Platform;
  /** Its place on the board, which staggers its turn to the next picker */
  index: number;
  /** Runs the picker on its screen; off in the layout the screen's width hides */
  live: boolean;
  /** With the platform rail, for the single device on narrow screens */
  onPlatformChange?: (platform: Platform) => void;
}

/** One device on the board, on the shared value, turning to each new picker a beat after the one before it. */
export const SpecDevice = ({ spec: nextSpec, platform, index, live, onPlatformChange, values, set }: SpecDeviceProps) => {
  const { colorMode } = useColorMode();
  const spec = useDelayedValue(nextSpec, onPlatformChange ? 0 : index * HERO_STAGGER_MS);
  return (
    <div className={styles.spec}>
      <Device platform={platform} onPlatformChange={onPlatformChange} rail={!!onPlatformChange}>
        {(shown, screenHeight) =>
          live && (
            <div key={`${shown}-${spec.word}`} className={styles.screenIn}>
              <BrowserHeroApp spec={spec} platform={shown} colorMode={colorMode} values={values} set={set} screenHeight={screenHeight} />
            </div>
          )
        }
      </Device>
    </div>
  );
};
