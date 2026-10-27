import type { ColorMode } from '@docusaurus/theme-common';

import type { Platform } from '../device/device.types';
import type { ValueOf } from '../home.types';
import type { Playground } from '../playground/playground.types';
import type { RESERVE_PHASE } from './demo.constants';

export type DemoState = Pick<Playground, 'tab' | 'options' | 'accent' | 'selectTab' | 'stopAutoplay'>;

export interface DemoScreenProps {
  platform: Platform;
  screenHeight?: number;
  demo: DemoState;
}

export interface DemoAppProps extends DemoScreenProps {
  colorMode: ColorMode;
}

export type ReservePhase = ValueOf<typeof RESERVE_PHASE>;

export interface Guests {
  adults: number;
  children: number;
}

export type TourTarget =
  | { kind: 'field'; label: string }
  | { kind: 'option' }
  | { kind: 'day'; end: 'from' | 'to' }
  | { kind: 'confirm' }
  | { kind: 'reserve' };

export interface TourStep {
  target: TourTarget;
  /** Wait before moving to the target */
  pause: number;
}

export interface TourTrip {
  city: string;
  from: number;
  to: number;
}

export interface BookingAppProps {
  colorMode: ColorMode;
  platform: Platform;
  screenHeight?: number;
}
