import { Text, View } from 'react-native';

import { textStyle } from '../../core';
import { COLOR_A11Y_ACTIONS, COLOR_DESIGN, COLOR_STEP, SLIDER_THUMB_SIZE } from '../color.constants';
import { styles } from '../color.styles';
import type { ColorSliderProps } from '../color.types';
import { toSlices } from '../color.utils';
import { useTrackPan } from '../hooks/useTrackPan';
import { Checkerboard } from './Checkerboard';

const INSET = SLIDER_THUMB_SIZE / 2;

/** A slider over its own gradient, drawn as slices of solid colour; 44pt to touch however thin the track. */
export const ColorSlider = ({
  label,
  value,
  onChange,
  colors,
  thumbColor,
  valueText,
  showLabel = false,
  showValue = false,
  checkered = false,
  theme,
  slots,
  testID,
}: ColorSliderProps) => {
  const pan = useTrackPan((x) => onChange(x), INSET);
  const { trackHeight } = COLOR_DESIGN[theme.design];
  const caption = [textStyle(theme, 'sm'), { color: theme.colors.textSecondary }, slots?.sliderLabel];
  return (
    <View>
      {showLabel || showValue ? (
        <View style={styles.sliderHeader}>
          <Text style={caption}>{showLabel ? label : ''}</Text>
          {showValue ? <Text style={caption}>{valueText}</Text> : null}
        </View>
      ) : null}
      <View
        style={[styles.slider, slots?.slider]}
        onLayout={pan.onLayout}
        {...pan.panHandlers}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityValue={{ text: valueText }}
        accessibilityActions={COLOR_A11Y_ACTIONS}
        onAccessibilityAction={(e) => {
          const step = e.nativeEvent.actionName === 'increment' ? COLOR_STEP : -COLOR_STEP;
          onChange(Math.min(1, Math.max(0, value + step)));
        }}
        testID={testID}
      >
        <View pointerEvents="none" style={[styles.rail, { height: trackHeight, marginHorizontal: INSET }]}>
          <View style={[styles.track, { borderRadius: trackHeight / 2 }]}>
            {checkered ? <Checkerboard /> : null}
            {toSlices(colors).map(({ key, color }) => (
              <View key={key} style={[styles.fill, { backgroundColor: color }]} />
            ))}
          </View>
          <View
            style={[
              styles.sliderThumb,
              { left: `${value * 100}%`, top: (trackHeight - SLIDER_THUMB_SIZE) / 2, backgroundColor: thumbColor },
              slots?.sliderThumb,
            ]}
          />
        </View>
      </View>
    </View>
  );
};
