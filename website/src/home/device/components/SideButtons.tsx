import clsx from 'clsx';

import { PLATFORM } from '../device.constants';
import styles from '../device.module.css';
import type { Platform } from '../device.types';

const BUTTONS: Partial<Record<Platform, string[]>> = {
  [PLATFORM.ios]: [styles.actionButton, styles.volumeUp, styles.volumeDown, styles.powerButton],
  [PLATFORM.android]: [styles.androidPower, styles.androidVolume],
};

export const SideButtons = ({ platform }: { platform: Platform }) =>
  BUTTONS[platform]?.map((button) => <span key={button} className={clsx(styles.sideButton, button)} aria-hidden />);
