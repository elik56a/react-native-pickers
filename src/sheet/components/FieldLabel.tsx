import { Text } from 'react-native';

import { textStyle } from '../../core';
import { styles } from '../sheet.styles';
import type { FieldLabelProps } from '../sheet.types';

export const FieldLabel = ({ label, theme, style }: FieldLabelProps) => (
  <Text style={[textStyle(theme, 'sm', 'medium'), styles.fieldLabel, { color: theme.colors.textSecondary }, style]}>{label}</Text>
);
