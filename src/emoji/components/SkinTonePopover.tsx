import { Pressable, StyleSheet, View } from 'react-native';

import { Touchable } from '../../core/components/Touchable';
import { CLOSE_LABEL } from '../../core/core.constants';
import { SKIN_TONES, TONE_POPOVER_PADDING } from '../emoji.constants';
import { styles } from '../emoji.styles';
import type { SkinTonePopoverProps } from '../emoji.types';
import { withSkinTone } from '../emoji.utils';
import { EmojiGlyph } from './EmojiGlyph';

/** One emoji in every skin tone, over the emoji that was long-pressed; a tap outside closes it. */
export const SkinTonePopover = ({
  emoji,
  left,
  top,
  size,
  fontSize,
  renderEmoji,
  onSelect,
  onClose,
  theme,
  slots,
}: SkinTonePopoverProps) => (
  <>
    <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" accessibilityLabel={CLOSE_LABEL} />
    <View
      style={[
        styles.tonePopover,
        {
          left,
          top,
          padding: TONE_POPOVER_PADDING,
          backgroundColor: theme.colors.sheet,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.md,
          boxShadow: `0px 8px 24px ${theme.colors.backdrop}`,
        },
        slots?.skinTonePopover,
      ]}
    >
      {SKIN_TONES.map((tone) => {
        const char = withSkinTone(emoji, tone);
        return (
          <Touchable
            key={tone}
            theme={theme}
            onPress={() => onSelect(tone)}
            accessibilityRole="button"
            accessibilityLabel={`${emoji.name}, skin tone ${tone}`}
            style={[styles.cell, { width: size, height: size, borderRadius: theme.radius.sm }]}
          >
            <EmojiGlyph emoji={emoji} char={char} fontSize={fontSize} renderEmoji={renderEmoji} slots={slots} />
          </Touchable>
        );
      })}
    </View>
  </>
);
