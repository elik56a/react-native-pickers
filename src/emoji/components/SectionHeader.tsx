import { Text, View } from 'react-native';

import { textStyle } from '../../core';
import { EMOJI_DESIGN } from '../emoji.constants';
import { styles } from '../emoji.styles';
import type { SectionHeaderProps } from '../emoji.types';

export const SectionHeader = ({ label, theme, slots }: SectionHeaderProps) => (
  <View style={[styles.sectionHeader, slots?.sectionHeader]}>
    <Text
      style={[
        textStyle(theme, 'xs', 'bold'),
        { color: theme.colors.textSecondary },
        EMOJI_DESIGN[theme.design].uppercaseSectionHeaders && styles.uppercase,
        slots?.sectionHeaderText,
      ]}
    >
      {label}
    </Text>
  </View>
);
