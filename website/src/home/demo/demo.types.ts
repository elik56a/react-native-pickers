import type { ColorMode } from '@docusaurus/theme-common';

import type { Platform } from '../device/device.types';
import type { Playground } from '../playground/playground.types';

export type DemoState = Pick<Playground, 'tab' | 'options' | 'accent' | 'selectTab' | 'stopAutoplay'>;

export interface DemoScreenProps {
  platform: Platform;
  screenHeight?: number;
  demo: DemoState;
}

export interface DemoAppProps extends DemoScreenProps {
  colorMode: ColorMode;
}
