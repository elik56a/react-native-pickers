import { useState } from 'react';

import { COPIED_MS } from '../home.constants';

export const useCopyToClipboard = (text: string) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_MS);
  };
  return {
    copied,
    copy,
  };
};
