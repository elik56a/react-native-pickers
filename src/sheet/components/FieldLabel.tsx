import { Text } from 'react-native';

import { textStyle } from '../../core';
import { FIELD_DESIGN, FIELD_LABEL } from '../sheet.constants';
import { styles } from '../sheet.styles';
import type { FieldLabelProps } from '../sheet.types';

/** The label above a field; designs with a floating label draw it inside the field instead. */
export const FieldLabel = ({ label, theme, style }: FieldLabelProps) =>
  FIELD_DESIGN[theme.design].label === FIELD_LABEL.floating ? null : (
    <Text style={[textStyle(theme, 'sm', 'medium'), styles.fieldLabel, { color: theme.colors.textSecondary }, style]}>{label}</Text>
  );
