import { Pressable, Text, View } from 'react-native';
import { SearchInput } from '../../core/components/SearchInput';
import { TONE_SWATCHES } from '../emoji.constants';
import { styles } from '../emoji.styles';
import type { EmojiHeaderProps } from '../emoji.types';

export const EmojiHeader = ({
  searchable,
  showSkinTones,
  query,
  onQueryChange,
  searchPlaceholder,
  tone,
  onToneButtonPress,
  theme,
  slots,
}: EmojiHeaderProps) => (
  <View
    style={[styles.header, { paddingHorizontal: theme.spacing.sm, paddingTop: theme.spacing.sm, gap: theme.spacing.sm }, slots?.header]}
  >
    {searchable ? (
      <SearchInput
        value={query}
        onChangeText={onQueryChange}
        placeholder={searchPlaceholder}
        theme={theme}
        style={[styles.search, slots?.searchInput]}
      />
    ) : (
      <View style={styles.flex} />
    )}
    {showSkinTones && (
      <Pressable
        onPress={onToneButtonPress}
        accessibilityRole="button"
        accessibilityLabel="Skin tone"
        style={[styles.toneButton, { backgroundColor: theme.colors.surface, borderRadius: theme.radius.md }, slots?.skinToneButton]}
      >
        <Text style={styles.toneButtonText}>{TONE_SWATCHES[tone]}</Text>
      </Pressable>
    )}
  </View>
);
