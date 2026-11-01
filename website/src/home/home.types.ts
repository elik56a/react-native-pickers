import type { ReactNode } from 'react';

import type { HeroWord } from './hero/hero.types';
import type { ANATOMY_SIDE, NPM_DOWNLOADS_STATUS, SUPPORT } from './home.constants';

export type ValueOf<T> = T[keyof T];

export type Support = ValueOf<typeof SUPPORT>;

export interface CompareCell {
  support: Support;
  note?: string;
}

export interface CompareRow {
  feature: string;
  cells: CompareCell[];
}

export interface FaqEntry {
  question: string;
  answer: ReactNode;
}

export type NpmDownloads = number | ValueOf<typeof NPM_DOWNLOADS_STATUS>;

export interface AnatomyCallout {
  side: ValueOf<typeof ANATOMY_SIDE>;
  /** How far down the device the leader line points, in % */
  y: number;
  title: string;
  body: string;
}

export interface AnatomyExample {
  /** The hero screen it shows */
  word: HeroWord;
  callouts: AnatomyCallout[];
}
