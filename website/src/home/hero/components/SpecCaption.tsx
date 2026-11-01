import { PLATFORM_LABELS } from '../../device/device.constants';
import type { Platform } from '../../device/device.types';
import styles from '../hero.module.css';
import type { HeroWordSpec } from '../hero.types';

interface SpecCaptionProps {
  spec: HeroWordSpec;
  platform: Platform;
  /** Its number on the board: 01, 02, 03 */
  index: number;
}

/** A device's spec-sheet label: its number, its platform and the pattern its design follows, on a hairline. */
export const SpecCaption = ({ spec, platform, index }: SpecCaptionProps) => (
  <p className={styles.caption}>
    <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
    <span className={styles.platform}>{PLATFORM_LABELS[platform]}</span>
    <span className={styles.pattern}>{spec.patterns[platform]}</span>
  </p>
);
