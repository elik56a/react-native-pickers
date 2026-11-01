import { Text, View } from 'react-native';

import { PickerText } from '../../core/components/PickerText';
import { CHECK_MARK } from '../../core/core.constants';
import { SELECT_DESIGN } from '../select.constants';
import { styles } from '../select.styles';
import type { CheckProps } from '../select.types';

/** A checkbox for multiple select; for single select, a radio or a tick. */
export const Check = ({ selected, multiple, radio, theme, style }: CheckProps) => {
  const c = theme.colors;
  if (!multiple && radio) {
    return (
      <View style={[styles.radio, { marginStart: theme.spacing.md, borderColor: selected ? c.primary : c.textSecondary }, style]}>
        {selected && <View style={[styles.radioDot, { backgroundColor: c.primary }]} />}
      </View>
    );
  }
  if (!multiple) {
    return (
      <PickerText theme={theme} weight="bold" color="primary" style={[{ marginStart: theme.spacing.md }, style]}>
        {CHECK_MARK}
      </PickerText>
    );
  }
  const { size, radius, offColor } = SELECT_DESIGN[theme.design].checkbox;
  return (
    <View
      style={[
        styles.checkBox,
        {
          width: size,
          height: size,
          borderRadius: radius,
          marginStart: theme.spacing.md,
          borderColor: selected ? c.primary : c[offColor],
          backgroundColor: selected ? c.primary : 'transparent',
        },
        style,
      ]}
    >
      {selected && <Text style={[styles.checkBoxMark, { color: c.onPrimary }]}>{CHECK_MARK}</Text>}
    </View>
  );
};
