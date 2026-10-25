import { Text, View } from 'react-native';
import { textStyle } from '../../core';
import { CHECK_MARK } from '../select.constants';
import { styles } from '../select.styles';
import type { CheckProps } from '../select.types';

/** A tick for single select, a checkbox for multiple. */
export const Check = ({ selected, multiple, theme, style }: CheckProps) => {
  const c = theme.colors;
  if (!multiple) {
    return <Text style={[textStyle(theme, 'md', 'bold'), { color: c.primary, marginStart: theme.spacing.md }, style]}>{CHECK_MARK}</Text>;
  }
  return (
    <View
      style={[
        styles.checkBox,
        {
          marginStart: theme.spacing.md,
          borderColor: selected ? c.primary : c.border,
          backgroundColor: selected ? c.primary : 'transparent',
        },
        style,
      ]}
    >
      {selected ? <Text style={[styles.checkBoxMark, { color: c.onPrimary }]}>{CHECK_MARK}</Text> : null}
    </View>
  );
};
