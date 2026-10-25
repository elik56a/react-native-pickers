import { memo } from 'react';
import { Pressable, Text } from 'react-native';
import { styles } from '../emoji.styles';
import type { EmojiCellProps } from '../emoji.types';

export const EmojiCell = memo(({ emoji, char, size, fontSize, renderEmoji, onSelect, theme, slots }: EmojiCellProps) => (
  <Pressable
    onPress={() => onSelect(emoji)}
    accessibilityRole="button"
    accessibilityLabel={emoji.name}
    style={({ pressed }) => [
      styles.cell,
      { width: size, height: size, borderRadius: theme.radius.sm },
      pressed && [styles.cellPressed, { backgroundColor: theme.colors.surface }],
      slots?.emojiCell,
    ]}
  >
    {renderEmoji ? (
      renderEmoji(char, emoji, fontSize)
    ) : (
      <Text style={[{ fontSize, lineHeight: fontSize * 1.2 }, slots?.emojiText]}>{char}</Text>
    )}
  </Pressable>
));
