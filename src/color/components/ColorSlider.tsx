import { View } from 'react-native';

import { PickerText } from '../../core/components/PickerText';
import { KNOB_SIZE } from '../../core/core.constants';
import { useTrackPan } from '../../core/hooks/useTrackPan';
import { adjustableProps } from '../../core/utils/adjustable.utils';
import { clamp01 } from '../../core/utils/track.utils';
import { COLOR_DESIGN, COLOR_STEP } from '../color.constants';
import { styles } from '../color.styles';
import type { ColorSliderProps } from '../color.types';
import { toSlices } from '../color.utils';
import { Checkerboard } from './Checkerboard';

const INSET = KNOB_SIZE / 2;

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
  const pan = useTrackPan({ onMove: (x) => onChange(x), insetX: INSET });
  const { trackHeight } = COLOR_DESIGN[theme.design];
  return (
    <View>
      {(showLabel || showValue) && (
        <View style={styles.sliderHeader}>
          <PickerText theme={theme} size="sm" color="textSecondary" style={slots?.sliderLabel}>
            {showLabel ? label : ''}
          </PickerText>
          {showValue && (
            <PickerText theme={theme} size="sm" color="textSecondary" style={slots?.sliderLabel}>
              {valueText}
            </PickerText>
          )}
        </View>
      )}
      <View
        style={[styles.slider, slots?.slider]}
        onLayout={pan.onLayout}
        {...pan.panHandlers}
        {...adjustableProps({
          label,
          valueText,
          onStep: (direction) => onChange(clamp01(value + direction * COLOR_STEP)),
          onMin: () => onChange(0),
          onMax: () => onChange(1),
        })}
        testID={testID}
      >
        <View pointerEvents="none" style={[styles.rail, { height: trackHeight, marginHorizontal: INSET }]}>
          <View style={[styles.track, { borderRadius: trackHeight / 2 }]}>
            {checkered && <Checkerboard />}
            {toSlices(colors).map(({ key, color }) => (
              <View key={key} style={[styles.fill, { backgroundColor: color }]} />
            ))}
          </View>
          <View
            style={[
              styles.sliderThumb,
              { left: `${value * 100}%`, top: (trackHeight - KNOB_SIZE) / 2, backgroundColor: thumbColor },
              slots?.sliderThumb,
            ]}
          />
        </View>
      </View>
    </View>
  );
};
