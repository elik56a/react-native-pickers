import type { ColorMode } from '@docusaurus/theme-common';

import type { DateRange } from '@elik56a/react-native-pickers';
import type { Platform } from '../device/device.types';
import type { ValueOf } from '../home.types';
import type { Playground } from '../playground/playground.types';
import type { RESERVE_PHASE } from './demo.constants';

export type ReservePhase = ValueOf<typeof RESERVE_PHASE>;

export interface Guests {
  adults: number;
  children: number;
}

/** The playground's props and theme, and where to report the field the visitor touched; the hero runs without. */
export type BookingPlayground = Pick<Playground, 'options' | 'accent' | 'selectTab'>;

export interface BookingScreenProps {
  platform: Platform;
  screenHeight?: number;
  playground?: BookingPlayground;
}

export interface BookingAppProps extends BookingScreenProps {
  colorMode: ColorMode;
}

/** A Dates pick in any calendar mode */
export type BookedDates = Date | DateRange | Date[] | DateRange[] | null;
