import { useState } from 'react';

import { COPIED_MS } from '../home.constants';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const useCopyToClipboard = (text: string) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(text);
    window.gtag?.('event', 'copy', { text: text.slice(0, 100) });
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_MS);
  };
  return {
    copied,
    copy,
  };
};
