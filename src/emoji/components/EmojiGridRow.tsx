import { useCallback, useRef } from 'react';
import type { HostInstance } from 'react-native';
import { View } from 'react-native';

import { styles } from '../emoji.styles';
import type { Emoji, EmojiGridRowProps } from '../emoji.types';
import { withSkinTone } from '../emoji.utils';
import { EmojiCell } from './EmojiCell';

export const EmojiGridRow = ({ items, chars, tone, onLongPress, ...cell }: EmojiGridRowProps) => {
  const ref = useRef<HostInstance>(null);
  // Rows are rebuilt on every pick, so `items` is read at press time: a stable handler keeps the memoized cells from re-rendering.
  const latestItems = useRef(items);
  latestItems.current = items;
  const longPress = useCallback((e: Emoji) => onLongPress?.(e, ref.current, latestItems.current.indexOf(e)), [onLongPress]);
  return (
    <View ref={ref} style={styles.row}>
      {items.map((e, i) => (
        <EmojiCell
          key={e.emoji}
          emoji={e}
          char={chars?.[i] ?? withSkinTone(e, tone)}
          onLongPress={onLongPress && e.skins ? longPress : undefined}
          {...cell}
        />
      ))}
    </View>
  );
};
