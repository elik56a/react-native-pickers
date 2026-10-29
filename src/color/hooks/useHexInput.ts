import { useState } from 'react';

import { normalizeHex } from '../color.utils';

const FULL_HEX = /^#?([0-9a-f]{6}|[0-9a-f]{8})$/i;

/** The hex field's text: the colour, or what's being typed. Six or eight digits apply as typed; a short code like 'f80' on leaving the field. */
export const useHexInput = (color: string, onChange: (color: string) => void) => {
  const [typed, setTyped] = useState<string | null>(null);
  return {
    text: typed ?? color,
    onChangeText: (text: string) => {
      setTyped(text);
      const next = FULL_HEX.test(text) ? normalizeHex(text) : null;
      if (next) onChange(next);
    },
    onBlur: () => {
      const next = typed === null ? null : normalizeHex(typed);
      if (next) onChange(next);
      setTyped(null);
    },
  };
};
