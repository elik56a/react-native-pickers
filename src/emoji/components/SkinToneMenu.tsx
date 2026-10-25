import { Pressable, Text, View } from 'react-native';

import { TONE_SWATCHES } from '../emoji.constants';
import { styles } from '../emoji.styles';
import type { SkinTone, SkinToneMenuProps } from '../emoji.types';

export const SkinToneMenu = ({ tone, onSelect, theme, slots }: SkinToneMenuProps) => (
  <View
    style={[
      styles.toneMenu,
      { marginHorizontal: theme.spacing.sm, backgroundColor: theme.colors.surface, borderRadius: theme.radius.md },
      slots?.skinToneMenu,
    ]}
  >
    {TONE_SWATCHES.map((swatch, i) => (
      <Pressable
        key={swatch}
        onPress={() => onSelect(i as SkinTone)}
        accessibilityRole="button"
        accessibilityLabel={`Skin tone ${i}`}
        accessibilityState={{ selected: i === tone }}
        style={[
          styles.toneOption,
          { borderRadius: theme.radius.sm, backgroundColor: i === tone ? theme.colors.primaryMuted : 'transparent' },
        ]}
      >
        <Text style={styles.toneOptionText}>{swatch}</Text>
      </Pressable>
    ))}
  </View>
);
