import { Text } from 'react-native';

import { EMOJI_LINE_HEIGHT } from '../emoji.constants';
import type { EmojiGlyphProps } from '../emoji.types';

/** The emoji character, or the app's own `renderEmoji`. */
export const EmojiGlyph = ({ emoji, char, fontSize, renderEmoji, slots }: EmojiGlyphProps) => {
  if (renderEmoji) return renderEmoji(char, emoji, fontSize);
  return (
    <Text selectable={false} style={[{ fontSize, lineHeight: fontSize * EMOJI_LINE_HEIGHT }, slots?.emojiText]}>
      {char}
    </Text>
  );
};
