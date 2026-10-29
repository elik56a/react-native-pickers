import { Text } from 'react-native';

import { STAR_GLYPH } from '../rating.constants';
import { styles } from '../rating.styles';
import type { RatingIconProps } from '../rating.types';

/** The custom icon, or a ★ in the star's colour. */
export const RatingIcon = ({ info, renderIcon, slots }: RatingIconProps) =>
  renderIcon ? (
    renderIcon(info)
  ) : (
    <Text style={[styles.glyph, { width: info.size, fontSize: info.size, lineHeight: info.size, color: info.color }, slots?.icon]}>
      {STAR_GLYPH}
    </Text>
  );
