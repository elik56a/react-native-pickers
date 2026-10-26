import type React from 'react';

import { NPM_DOWNLOADS_SINCE, NPM_DOWNLOADS_STATUS, PACKAGE, REVEAL_STEP_MS } from './home.constants';
import type { NpmDownloads } from './home.types';

/** npm counts downloads by UTC day, so the end date is the UTC one. */
export const npmDownloadsUrl = (now: Date) =>
  `https://api.npmjs.org/downloads/point/${NPM_DOWNLOADS_SINCE}:${now.toISOString().slice(0, 10)}/${PACKAGE}`;

export const parseDownloads = (data: unknown): NpmDownloads => {
  const downloads = (data as { downloads?: unknown } | null)?.downloads;
  return typeof downloads === 'number' ? downloads : NPM_DOWNLOADS_STATUS.unavailable;
};

export const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/** Staggers the hero's entrance animation. */
export const revealDelay = (step: number) => ({ '--delay': `${step * REVEAL_STEP_MS}ms` }) as React.CSSProperties;

/** Staggers scroll reveals within a section. */
export const revealAt = (index: number) => ({ '--reveal-index': index }) as React.CSSProperties;
