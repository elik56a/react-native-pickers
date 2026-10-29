import { useEffect, useState } from 'react';

import { NPM_DOWNLOADS_STATUS, NPM_DOWNLOADS_URL } from '../home.constants';
import type { NpmDownloads } from '../home.types';
import { parseDownloads } from '../home.utils';

/** Fetched in the browser so the count stays current between site builds. */
export const useNpmDownloads = () => {
  const [downloads, setDownloads] = useState<NpmDownloads>(NPM_DOWNLOADS_STATUS.loading);
  useEffect(() => {
    const controller = new AbortController();
    fetch(NPM_DOWNLOADS_URL, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setDownloads(parseDownloads(data)))
      .catch(() => {
        if (!controller.signal.aborted) setDownloads(NPM_DOWNLOADS_STATUS.unavailable);
      });
    return () => controller.abort();
  }, []);
  return downloads;
};
