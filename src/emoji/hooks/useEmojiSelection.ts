import { useCallback, useState } from 'react';

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

  const select = useCallback(
    (e: Emoji) => {
      onSelect(withSkinTone(e, tone), e);
      if (showRecent) setRecent(addRecent(recent, e, maxRecent));
    },
    [maxRecent, onSelect, recent, setRecent, showRecent, tone]
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
