import { View } from 'react-native';

import { styles } from '../rating.styles';
import type { RatingItemProps } from '../rating.types';
import { RatingIcon } from './RatingIcon';

/** An empty star, with the filled one over it cut to how much of it the rating reaches. Touches go to the row. */
export const RatingItem = ({ item, size, color, emptyColor, renderIcon, slots, testID }: RatingItemProps) => {
  const box = { width: size, height: size };

  return (
    <View pointerEvents="none" style={[box, slots?.item]} testID={testID}>
      <RatingIcon info={{ index: item.index, filled: false, color: emptyColor, size }} renderIcon={renderIcon} slots={slots} />
      {item.fill > 0 ? (
        <View style={[styles.fill, { width: item.fill * size }]}>
          <View style={box}>
            <RatingIcon info={{ index: item.index, filled: true, color, size }} renderIcon={renderIcon} slots={slots} />
          </View>
        </View>
      ) : null}
    </View>
  );
};
