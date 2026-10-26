import { BROWSER_URL, PLATFORM, STATUS_BAR_TIME } from '../device.constants';
import styles from '../device.module.css';
import type { Platform } from '../device.types';
import { AndroidStatusIcons, IosStatusIcons } from './StatusIcons';

/** The phone status bar, or the browser chrome on web. */
export const TopBar = ({ platform }: { platform: Platform }) =>
  platform === PLATFORM.web ? (
    <div className={styles.browserBar} aria-hidden>
      <span className={styles.trafficLights}>
        <i />
        <i />
        <i />
      </span>
      <span className={styles.url}>{BROWSER_URL}</span>
    </div>
  ) : (
    <div className={styles.statusBar} aria-hidden>
      <span>{STATUS_BAR_TIME}</span>
      <span className={styles.camera} />
      {platform === PLATFORM.ios ? <IosStatusIcons /> : <AndroidStatusIcons />}
    </div>
  );
