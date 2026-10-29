import { Text, TextInput, View } from 'react-native';

import { textStyle } from '../../core';
import { styles as timeStyles } from '../../time/time.styles';
import { NUMERIC_KEYBOARD_TYPE } from '../../wheel/wheel.constants';
import { styles } from '../duration.styles';
import type { DurationInputProps } from '../duration.types';
import { getMaxDigits } from '../duration.utils';
import { useDurationInput } from '../hooks/useDurationInput';

/** Material's take on a duration: a box per unit to type the number into, the unit beside it, as in its time input. */
export const DurationInput = ({ columns, theme, style, testID }: DurationInputProps) => {
  const c = theme.colors;
  const input = useDurationInput();
  return (
    <View style={[styles.input, { gap: theme.spacing.md, paddingVertical: theme.spacing.md }, style]} testID={testID}>
      {columns.map((column) => (
        <View key={column.key} style={[styles.inputUnit, { gap: theme.spacing.xs }]}>
          <TextInput
            value={input.text(column)}
            onChangeText={(text) => input.type(column, text)}
            onFocus={() => input.focus(column)}
            onBlur={input.blur}
            keyboardType={NUMERIC_KEYBOARD_TYPE}
            maxLength={getMaxDigits(column.items)}
            selectTextOnFocus
            accessibilityLabel={column.accessibilityLabel}
            style={[
              textStyle(theme, 'xl'),
              timeStyles.fieldInput,
              styles.field,
              {
                borderRadius: theme.radius.sm,
                backgroundColor: c.surface,
                borderColor: input.focused === column.key ? c.primary : 'transparent',
              },
            ]}
            testID={column.testID}
          />
          <Text style={[textStyle(theme, 'md'), { color: c.textSecondary }]}>{column.suffix}</Text>
        </View>
      ))}
    </View>
  );
};
