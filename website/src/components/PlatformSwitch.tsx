import type { HorizontalListIconInfo, HorizontalListIconPosition } from '@elik56a/react-native-pickers';
import { PlatformIcon } from '../home/device/components/PlatformRail';
import { PLATFORM_LABELS, PLATFORMS } from '../home/device/device.constants';
import type { Platform } from '../home/device/device.types';
import { Choices } from './Choices';
import styles from './PlatformSwitch.module.css';
import rowStyles from './PropPlayground.module.css';

interface PlatformSwitchProps {
  platform: Platform;
  onChange: (platform: Platform) => void;
}

const ICON_SIZE = 16;

const ICONS = PLATFORMS.map((platform) => ({ color }: HorizontalListIconInfo) => (
  <PlatformIcon platform={platform} size={ICON_SIZE} color={color} />
));

const PlatformChoices = ({ platform, onChange, iconPosition }: PlatformSwitchProps & { iconPosition: HorizontalListIconPosition }) => (
  <Choices
    label="Preview platform"
    labels={PLATFORMS.map((p) => PLATFORM_LABELS[p])}
    icons={ICONS}
    iconPosition={iconPosition}
    selected={PLATFORMS.indexOf(platform)}
    onChoose={(i) => onChange(PLATFORMS[i])}
  />
);

/** iOS / Android / Web, over the top left of a preview with no props panel: how the example behaves and looks, not its code. Its container needs `position: relative`. */
export const PlatformSwitch = (props: PlatformSwitchProps) => (
  <div className={styles.platforms}>
    <PlatformChoices {...props} iconPosition="left" />
  </div>
);

/** The same switch as the first row of a props panel, each icon above its name, so it never sits over the preview. */
export const PlatformRow = (props: PlatformSwitchProps) => (
  <div className={rowStyles.row}>
    <span className={rowStyles.prop}>Platform</span>
    <PlatformChoices {...props} iconPosition="top" />
  </div>
);
