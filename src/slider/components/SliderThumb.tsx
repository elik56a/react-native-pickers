import { View } from 'react-native';

import { TOUCH_TARGET } from '../../core/core.constants';
import { SLIDER_THUMB } from '../slider.constants';
import { styles } from '../slider.styles';
import type { SliderThumbProps } from '../slider.types';

/** A knob, bar or dot centred on its value. It takes keys and screen-reader steps; touches go to the track under it. */
export const SliderThumb = ({ thumb, design, theme, slots, testID }: SliderThumbProps) => (
  <View
    pointerEvents="none"
    style={[
      styles.thumb,
      design.thumb === SLIDER_THUMB.knob ? styles.knob : { backgroundColor: theme.colors.primary },
      {
        start: thumb.x - thumb.width / 2,
        top: (TOUCH_TARGET - design.thumbHeight) / 2,
        width: thumb.width,
        height: design.thumbHeight,
        borderRadius: thumb.width / 2,
      },
      slots?.thumb,
    ]}
    {...thumb.adjustable}
    onFocus={thumb.onFocus}
    onBlur={thumb.onBlur}
    testID={testID}
  />
);
