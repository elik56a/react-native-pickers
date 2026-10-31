import type { ReactNode } from 'react';

import type { CountryCode } from '@elik56a/react-native-pickers';
import type { BookingScreenProps } from '../home/demo/demo.types';
import type { ValueOf } from '../home/home.types';
import type { ALBUM_SORT, SHOWCASE_SCREEN, TRIP_TYPE } from './showcase.constants';

export type ShowcaseScreenKey = ValueOf<typeof SHOWCASE_SCREEN>;

export type TripType = ValueOf<typeof TRIP_TYPE>;

export type AlbumSort = ValueOf<typeof ALBUM_SORT>;

export interface Album {
  name: string;
  emoji: string;
  photos: number;
}

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

export interface ApplicationValues {
  role: string | null;
  country: CountryCode | null;
  /** E.164, '' when empty */
  phone: string;
  /** From PhoneField: the number has the country's length */
  phoneValid: boolean;
  startDate: Date | null;
  interview?: Date;
  skills: string[];
}

export type ApplicationField = Exclude<keyof ApplicationValues, 'phoneValid'>;

export type ApplicationErrors = Partial<Record<ApplicationField, string>>;

export interface TimerPreset {
  label: string;
  /** Seconds */
  value: number;
}
