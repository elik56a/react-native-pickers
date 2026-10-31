import { Text } from 'react-native';

import { textStyle } from '../../core';
import { FIELD_DESIGN, FIELD_LABEL, REQUIRED_MARK } from '../sheet.constants';
import { styles } from '../sheet.styles';
import type { FieldLabelProps } from '../sheet.types';

/** The label above a field; designs with a floating label draw it inside the field instead. */
export const FieldLabel = ({ label, invalid, required, theme, style }: FieldLabelProps) =>
  FIELD_DESIGN[theme.design].label === FIELD_LABEL.floating ? null : (
    <Text
      style={[
        textStyle(theme, 'sm', 'medium'),
        styles.fieldLabel,
        { color: invalid ? theme.colors.danger : theme.colors.textSecondary },
        style,
      ]}
    >
      {label}
      {required ? REQUIRED_MARK : null}
    </Text>
  );
