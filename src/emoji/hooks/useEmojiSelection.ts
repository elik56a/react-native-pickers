import { useCallback, useRef, useState } from 'react';

import { useControllableState } from '../../core/hooks/useControllableState';
import type { Emoji, EmojiPickerProps, SkinTone } from '../emoji.types';
import { addRecent, withSkinTone } from '../emoji.utils';

/** Skin tone (and its menu) plus recents; `select` reports the toned emoji and records it as recent. */
export const useEmojiSelection = (props: EmojiPickerProps, showRecent: boolean, maxRecent: number) => {
  const { onSelect } = props;
  const [tone, setTone] = useControllableState<SkinTone>(props.skinTone, props.defaultSkinTone ?? 0, props.onSkinToneChange);
  const [recent, setRecent] = useControllableState(props.recent, props.defaultRecent ?? [], props.onRecentChange);
  const [toneMenuOpen, setToneMenuOpen] = useState(false);

  const toggleToneMenu = useCallback(() => setToneMenuOpen((open) => !open), []);

  const pickTone = useCallback(
    (next: SkinTone) => {
      setTone(next);
      setToneMenuOpen(false);
    },
    [setTone]
  );

  // Read at press time, so `select` keeps one identity and the memoized cells don't re-render when the parent passes a new onSelect.
  const latest = useRef({ onSelect, tone, recent, setRecent });
  latest.current = { onSelect, tone, recent, setRecent };

  const select = useCallback(
    (e: Emoji) => {
      const current = latest.current;
      current.onSelect(withSkinTone(e, current.tone), e);
      if (showRecent) current.setRecent(addRecent(current.recent, e, maxRecent));
    },
    [maxRecent, showRecent]
  );

  return {
    tone,
    recent,
    toneMenuOpen,
    toggleToneMenu,
    pickTone,
    select,
  };
};
