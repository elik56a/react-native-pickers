import { memo } from 'react';

import { Touchable } from '../../core/components/Touchable';
import { styles } from '../emoji.styles';
import type { EmojiCellProps } from '../emoji.types';
import { EmojiGlyph } from './EmojiGlyph';

export const EmojiCell = memo(({ emoji, char, size, fontSize, renderEmoji, onSelect, onLongPress, theme, slots }: EmojiCellProps) => (
  <Touchable
    theme={theme}
    onPress={() => onSelect(emoji, char)}
    onLongPress={onLongPress && (() => onLongPress(emoji))}
    accessibilityRole="button"
    accessibilityLabel={emoji.name}
    style={({ pressed }) => [
      styles.cell,
      { width: size, height: size, borderRadius: theme.radius.sm },
      pressed && styles.cellPressed,
      slots?.emojiCell,
    ]}
  >
    <EmojiGlyph emoji={emoji} char={char} fontSize={fontSize} renderEmoji={renderEmoji} slots={slots} />
  </Touchable>
));
