import { Choices } from '../../../components/Choices';
import { PLATFORM_LABELS, PLATFORMS } from '../device.constants';
import styles from '../device.module.css';
import type { Platform } from '../device.types';

export const PlatformTabs = ({ value, onChange }: { value: Platform; onChange: (platform: Platform) => void }) => (
  <div className={styles.platformTabs}>
    <Choices
      label="Preview platform"
      labels={PLATFORMS.map((platform) => PLATFORM_LABELS[platform])}
      selected={PLATFORMS.indexOf(value)}
      onChoose={(i) => onChange(PLATFORMS[i])}
    />
  </div>
);
