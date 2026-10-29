import { useState } from 'react';

import { useControllableState } from '../../core/hooks/useControllableState';
import { DEFAULT_COLOR } from '../color.constants';
import type { ColorPickerProps, ColorPickerState, Hsv } from '../color.types';
import { hexToHsv, hsvToHex, normalizeHex, splitAlpha, withAlpha } from '../color.utils';

/**
 * The colour as hex, as hue, saturation and brightness, and its opacity. The pad and sliders keep their own HSV, so taking
 * saturation to grey keeps the hue; a new value from outside resets them. Without `showAlpha` the colour stays opaque.
 */
export const useColorPicker = ({
  value,
  defaultValue,
  onChange,
  showAlpha,
}: Pick<ColorPickerProps, 'value' | 'defaultValue' | 'onChange' | 'showAlpha'>): ColorPickerState => {
  const [raw, setRaw] = useControllableState(value, defaultValue ?? DEFAULT_COLOR, onChange);
  const split = splitAlpha(normalizeHex(raw) ?? DEFAULT_COLOR);
  const alpha = showAlpha ? split.alpha : 1;
  const current = withAlpha(split.rgb, alpha);
  const [hsv, setHsvState] = useState<Hsv>(() => hexToHsv(split.rgb));
  if (hsvToHex(hsv) !== split.rgb) setHsvState(hexToHsv(split.rgb));

  const commit = (next: string) => {
    if (next !== current) setRaw(next);
  };

  return {
    value: current,
    rgb: split.rgb,
    hsv,
    alpha,
    select: (color) => {
      const next = normalizeHex(color);
      if (!next) return;
      const parts = splitAlpha(next);
      setHsvState(hexToHsv(parts.rgb));
      commit(withAlpha(parts.rgb, showAlpha ? parts.alpha : 1));
    },
    setHsv: (patch) => {
      const next = {
        ...hsv,
        ...patch,
      };
      setHsvState(next);
      commit(withAlpha(hsvToHex(next), alpha));
    },
    setAlpha: (next) => commit(withAlpha(split.rgb, next)),
  };
};
