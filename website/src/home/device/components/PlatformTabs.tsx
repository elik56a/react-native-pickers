import { PLATFORM_LABELS, PLATFORMS } from '../device.constants';
import styles from '../device.module.css';
import type { Platform } from '../device.types';
import { pillAt } from '../device.utils';

export const PlatformTabs = ({ value, onChange }: { value: Platform; onChange: (platform: Platform) => void }) => (
  <div role="tablist" aria-label="Preview platform" className={styles.platformTabs} style={pillAt(PLATFORMS.indexOf(value))}>
    <span className={styles.platformPill} aria-hidden />
    {PLATFORMS.map((platform) => (
      <button
        key={platform}
        type="button"
        role="tab"
        aria-selected={platform === value}
        className={styles.platformTab}
        onClick={() => onChange(platform)}
      >
        {PLATFORM_LABELS[platform]}
      </button>
    ))}
  </div>
);
