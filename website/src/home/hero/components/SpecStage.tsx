import { memo, useState } from 'react';

import clsx from 'clsx';

import { PLATFORM } from '../../device/device.constants';
import type { Platform } from '../../device/device.types';
import shared from '../../home.module.css';
import { HERO_PLATFORMS } from '../hero.constants';
import styles from '../hero.module.css';
import type { SpecStageProps } from '../hero.types';
import { SpecCaption } from './SpecCaption';
import { SpecDevice } from './SpecDevice';

/**
 * The board: the iPhone, the browser and the Pixel side by side on one value, or one device with the platform rail on narrow screens.
 * Both are in the page and CSS shows the one that fits (hero.module.css), so the first paint already has the right one; only that
 * one runs the pickers.
 */
export const SpecStage = memo(({ spec, wide, values, set }: SpecStageProps) => {
  const [platform, setPlatform] = useState<Platform>(PLATFORM.ios);
  const index = HERO_PLATFORMS.indexOf(platform);
  return (
    <>
      <div className={styles.single}>
        <SpecCaption spec={spec} platform={platform} index={index} />
        <SpecDevice spec={spec} platform={platform} index={index} live={!wide} onPlatformChange={setPlatform} values={values} set={set} />
      </div>
      <div className={clsx(styles.stage, shared.devices)}>
        {/* Flat above the board, so its lean doesn't tip the labels to different heights. */}
        <div className={styles.captions}>
          {HERO_PLATFORMS.map((p, i) => (
            <SpecCaption key={p} spec={spec} platform={p} index={i} />
          ))}
        </div>
        <div className={styles.board}>
          {HERO_PLATFORMS.map((p, i) => (
            <SpecDevice key={p} spec={spec} platform={p} index={i} live={wide} values={values} set={set} />
          ))}
        </div>
      </div>
    </>
  );
});
