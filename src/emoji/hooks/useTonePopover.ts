import { useCallback, useRef, useState } from 'react';
import type { HostInstance } from 'react-native';

import type { Emoji, EmojiLongPress, SkinTone, TonePopoverTarget } from '../emoji.types';
import { getTonePopoverPosition, withSkinTone } from '../emoji.utils';

/**
 * The skin tones a long press on an emoji opens, like an emoji keyboard. `rootRef` goes on the picker: the popover is placed inside it,
 * measured against it in the same coordinates as the pressed row, so it lines up in a sheet or a modal too.
 */
export const useTonePopover = (size: number, select: (emoji: Emoji, char: string) => void) => {
  const rootRef = useRef<HostInstance>(null);
  const [target, setTarget] = useState<TonePopoverTarget | null>(null);

  const open: EmojiLongPress = useCallback(
    (emoji, row, index) =>
      rootRef.current?.measureInWindow((rootX, rootY, rootWidth) =>
        row?.measureInWindow((rowX, rowY) => {
          const cell = {
            x: rowX - rootX + index * size,
            y: rowY - rootY,
            width: size,
            height: size,
          };
          setTarget({
            emoji,
            ...getTonePopoverPosition(cell, rootWidth, size),
          });
        })
      ),
    [size]
  );

  const close = useCallback(() => setTarget(null), []);

  const pick = useCallback(
    (tone: SkinTone) => {
      if (target) select(target.emoji, withSkinTone(target.emoji, tone));
      setTarget(null);
    },
    [select, target]
  );

  return {
    rootRef,
    target,
    open,
    close,
    pick,
  };
};
