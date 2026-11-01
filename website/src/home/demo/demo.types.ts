import type { DateRange, PickersProviderProps } from '@elik56a/react-native-pickers';
import type { Platform } from '../device/device.types';
import type { ValueOf } from '../home.types';
import type { Playground } from '../playground/playground.types';
import type { RESERVE_PHASE } from './demo.constants';

export type ReservePhase = ValueOf<typeof RESERVE_PHASE>;

export interface Guests {
  adults: number;
  children: number;
}

/** The playground's picker, props and theme, for the phone to show, and the step its Next button moves to. */
export type BookingPlayground = Pick<Playground, 'tab' | 'options' | 'accent' | 'selectTab'>;

export interface BookingScreenProps {
  platform: Platform;
  screenHeight?: number;
}

export interface PlaygroundScreenProps extends BookingScreenProps {
  playground: BookingPlayground;
}

export interface BookingAppProps extends PlaygroundScreenProps {
  colorMode: PickersProviderProps['colorScheme'];
}

/** A place shown with its flag, e.g. a city grouped by region */
export interface FlagPlace {
  label: string;
  flag: string;
  group?: string;
}

/** A Dates pick in any calendar mode */
export type BookedDates = Date | DateRange | Date[] | DateRange[] | null;
