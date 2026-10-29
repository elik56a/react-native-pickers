import { View } from 'react-native';

import { TOUCH_TARGET } from '../../core/core.constants';
import { styles } from '../slider.styles';
import type { SliderTrackProps } from '../slider.types';

/** The track in pieces around the thumbs, active ones in the primary colour, with the step and stop marks on it. */
export const SliderTrack = ({ segments, marks, design, theme, slots }: SliderTrackProps) => {
  const outer = design.trackHeight / 2;
  return (
    <View pointerEvents="none" style={[styles.rail, { top: (TOUCH_TARGET - design.trackHeight) / 2, height: design.trackHeight }]}>
      {segments.map((segment) => (
        <View
          key={segment.key}
          style={[
            styles.segment,
            {
              start: segment.start,
              width: segment.end - segment.start,
              backgroundColor: segment.active ? theme.colors.primary : theme.colors[design.inactiveTrack],
              borderTopStartRadius: segment.outerStart ? outer : design.innerRadius,
              borderBottomStartRadius: segment.outerStart ? outer : design.innerRadius,
              borderTopEndRadius: segment.outerEnd ? outer : design.innerRadius,
              borderBottomEndRadius: segment.outerEnd ? outer : design.innerRadius,
            },
            slots?.track,
            segment.active && slots?.activeTrack,
          ]}
        />
      ))}
      {marks.map((mark) => (
        <View
          key={mark.key}
          style={[
            styles.mark,
            {
              start: mark.x - design.markSize / 2,
              top: (design.trackHeight - design.markSize) / 2,
              width: design.markSize,
              height: design.markSize,
              borderRadius: design.markSize / 2,
              backgroundColor: mark.active ? theme.colors.onPrimary : theme.colors.primary,
            },
            slots?.mark,
          ]}
        />
      ))}
    </View>
  );
};
