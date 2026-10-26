import type { ReactNode } from 'react';

import type { NPM_DOWNLOADS_STATUS, SUPPORT } from './home.constants';

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
