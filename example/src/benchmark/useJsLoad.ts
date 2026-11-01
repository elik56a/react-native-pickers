import { useEffect } from 'react';

import { JS_LOAD_GAP_MS } from './benchmark.constants';

/** Blocks the JS thread for `blockMs` at a time, with a frame's gap between blocks, until `blockMs` is 0. */
export const useJsLoad = (blockMs: number) => {
  useEffect(() => {
    if (!blockMs) return;
    let timer: ReturnType<typeof setTimeout>;
    const block = () => {
      const end = Date.now() + blockMs;
      while (Date.now() < end) {
        // Busy-wait on purpose: this stands in for a long render.
      }
      timer = setTimeout(block, JS_LOAD_GAP_MS);
    };
    timer = setTimeout(block, JS_LOAD_GAP_MS);
    return () => clearTimeout(timer);
  }, [blockMs]);
};
