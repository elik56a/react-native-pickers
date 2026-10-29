import { useEffect, useRef, useState } from 'react';

import { COPIED_MS } from '../color.constants';

/** Copies with `copy`, and says so for a moment. */
export const useCopy = (copy: ((text: string) => unknown) | null) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return {
    copied,
    copy: copy
      ? async (text: string) => {
          await copy(text);
          setCopied(true);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setCopied(false), COPIED_MS);
        }
      : null,
  };
};
