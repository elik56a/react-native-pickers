import { Text, View } from 'react-native';

import { SearchInput } from '../../core/components/SearchInput';
import { Touchable } from '../../core/components/Touchable';
import { SEARCH_DESIGN } from '../../core/core.constants';
import { SKIN_TONE_LABEL, TONE_SWATCHES } from '../emoji.constants';
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
}: EmojiHeaderProps) => {
  const search = SEARCH_DESIGN[theme.design];
  return (
    <View
      style={[styles.header, { paddingHorizontal: theme.spacing.sm, paddingTop: theme.spacing.sm, gap: theme.spacing.sm }, slots?.header]}
    >
      {searchable ? (
        <SearchInput
          value={query}
          onChangeText={onQueryChange}
          placeholder={searchPlaceholder}
          theme={theme}
          style={slots?.searchInput}
          containerStyle={styles.flex}
        />
      ) : (
        <View style={styles.flex} />
      )}
      {showSkinTones && (
        <Touchable
          theme={theme}
          onPress={onToneButtonPress}
          accessibilityRole="button"
          accessibilityLabel={SKIN_TONE_LABEL}
          style={[
            styles.toneButton,
            {
              width: search.height,
              height: search.height,
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radius[search.radius],
            },
            slots?.skinToneButton,
          ]}
        >
          <Text style={styles.toneButtonText}>{TONE_SWATCHES[tone]}</Text>
        </Touchable>
      )}
    </View>
  );
};
