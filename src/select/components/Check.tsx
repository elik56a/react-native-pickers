import { Text, View } from 'react-native';

import { textStyle } from '../../core';
import { CHECK_MARK, SELECT_DESIGN } from '../select.constants';
import { styles } from '../select.styles';
import type { CheckProps } from '../select.types';

/** A checkbox for multiple select; for single select, a radio or a tick. */
export const Check = ({ selected, multiple, radio, theme, style }: CheckProps) => {
  const c = theme.colors;
  if (!multiple && radio) {
    return (
      <View style={[styles.radio, { marginStart: theme.spacing.md, borderColor: selected ? c.primary : c.textSecondary }, style]}>
        {selected ? <View style={[styles.radioDot, { backgroundColor: c.primary }]} /> : null}
      </View>
    );
  }
  if (!multiple) {
    return <Text style={[textStyle(theme, 'md', 'bold'), { color: c.primary, marginStart: theme.spacing.md }, style]}>{CHECK_MARK}</Text>;
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
      {selected ? <Text style={[styles.checkBoxMark, { color: c.onPrimary }]}>{CHECK_MARK}</Text> : null}
    </View>
  );
};
