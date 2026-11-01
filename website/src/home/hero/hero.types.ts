import type { CurrencyCode, DateRange, LanguageCode, TimeRange } from '@elik56a/react-native-pickers';
import type { Platform } from '../device/device.types';
import type { ValueOf } from '../home.types';
import type { HERO_WORD } from './hero.constants';

export type HeroWord = ValueOf<typeof HERO_WORD>;

export interface HeroWordSpec {
  word: HeroWord;
  /** The app screen the picker sits on */
  title: string;
  subtitle: string;
  /** The component, as in `<TimePicker … />` */
  tag: string;
  props: string;
  /** The pattern each design follows */
  patterns: Record<Platform, string>;
}

/** What the visitor picked, shared by the three devices. */
export interface HeroValues {
  time: Date;
  range: TimeRange;
  date: DateRange;
  month: Date;
  duration: number;
  color: string;
  amount: number | null;
  currency: CurrencyCode;
  language: LanguageCode;
  emoji: string;
}

export type HeroSetter = <K extends keyof HeroValues>(key: K) => (value: HeroValues[K]) => void;

export interface HeroPickerProps {
  values: HeroValues;
  set: HeroSetter;
  screenHeight?: number;
}

export interface HeroAppProps extends HeroPickerProps {
  spec: HeroWordSpec;
  platform: Platform;
  colorMode: 'light' | 'dark';
}

export interface WordWheelProps {
  value: HeroWord;
  onChange: (word: HeroWord) => void;
  wide: boolean;
  /** Centers the word, for the stacked headline on phones */
  centered: boolean;
  colorMode: 'light' | 'dark';
}

export interface CodeTapeProps {
  spec: HeroWordSpec;
  values: HeroValues;
}

export interface SpecStageProps extends HeroPickerProps {
  spec: HeroWordSpec;
  wide: boolean;
}
