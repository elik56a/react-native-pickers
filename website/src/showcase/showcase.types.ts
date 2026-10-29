import type { ReactNode } from 'react';

import type { BookingScreenProps } from '../home/demo/demo.types';
import type { ValueOf } from '../home/home.types';
import type { SHOWCASE_SCREEN, TRIP_TYPE } from './showcase.constants';

export type ShowcaseScreenKey = ValueOf<typeof SHOWCASE_SCREEN>;

export type TripType = ValueOf<typeof TRIP_TYPE>;

export interface ShowcaseItem {
  key: ShowcaseScreenKey;
  title: string;
  blurb: string;
  components: string[];
  /** A docs recipe that builds a screen like it */
  recipe?: string;
}

export type ScreenProps = Omit<BookingScreenProps, 'playground'>;

export interface ChatMessage {
  id: number;
  text: string;
  mine: boolean;
  time: string;
}

export interface TextSelection {
  start: number;
  end: number;
}

export interface SliderSettingProps {
  label: string;
  value: string;
  children: ReactNode;
}

export interface TimerPreset {
  label: string;
  /** Seconds */
  value: number;
}
