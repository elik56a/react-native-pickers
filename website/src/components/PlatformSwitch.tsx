import { PLATFORM_LABELS, PLATFORMS } from '../home/device/device.constants';
import type { Platform } from '../home/device/device.types';
import { Choices } from './Choices';
import styles from './PlatformSwitch.module.css';

interface PlatformSwitchProps {
  platform: Platform;
  onChange: (platform: Platform) => void;
}

/** iOS / Android / Web, over the top left of a preview: how the example behaves and looks, not its code. Its container needs `position: relative`. */
export const PlatformSwitch = ({ platform, onChange }: PlatformSwitchProps) => (
  <div className={styles.platforms}>
    <Choices
      label="Preview platform"
      labels={PLATFORMS.map((p) => PLATFORM_LABELS[p])}
      selected={PLATFORMS.indexOf(platform)}
      onChoose={(i) => onChange(PLATFORMS[i])}
    />
  </div>
);
