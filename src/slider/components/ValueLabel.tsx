import { Text, View } from 'react-native';

import { textStyle } from '../../core';
import { TOUCH_TARGET } from '../../core/core.constants';
import { VALUE_LABEL_BOX_WIDTH, VALUE_LABEL_GAP } from '../slider.constants';
import { styles } from '../slider.styles';
import type { ValueLabelProps } from '../slider.types';

/** Material's value bubble over the dragged thumb. */
export const ValueLabel = ({ x, text, design, theme, slots }: ValueLabelProps) => (
  <View
    pointerEvents="none"
    style={[
      styles.valueLabelBox,
      { start: x - VALUE_LABEL_BOX_WIDTH / 2, bottom: (TOUCH_TARGET + design.thumbHeight) / 2 + VALUE_LABEL_GAP },
    ]}
  >
    <View style={[styles.valueLabel, { backgroundColor: theme.colors.text, borderRadius: theme.radius.full }, slots?.valueLabel]}>
      <Text style={[textStyle(theme, 'sm'), { color: theme.colors.background }, slots?.valueLabelText]}>{text}</Text>
    </View>
  </View>
);
