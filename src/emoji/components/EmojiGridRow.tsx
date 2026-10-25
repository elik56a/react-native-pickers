import { View } from 'react-native';
import { styles } from '../emoji.styles';
import type { EmojiGridRowProps } from '../emoji.types';
import { withSkinTone } from '../emoji.utils';
import { EmojiCell } from './EmojiCell';

export const EmojiGridRow = ({ items, tone, ...cell }: EmojiGridRowProps) => (
  <View style={styles.row}>
    {items.map((e) => (
      <EmojiCell key={e.emoji} emoji={e} char={withSkinTone(e, tone)} {...cell} />
    ))}
  </View>
);
