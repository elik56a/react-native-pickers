import { Text } from 'react-native';

import { textStyle } from '../../core';
import { FIELD_DESIGN, FIELD_LABEL } from '../sheet.constants';
import { styles } from '../sheet.styles';
import type { FieldMessageProps } from '../sheet.types';
import { getFieldMessage } from '../sheet.utils';

/** The line under a field: the error message, or the helper text. Announced as it changes. */
export const FieldMessage = ({ error, helperText, theme, style }: FieldMessageProps) => {
  const message = getFieldMessage(error, helperText);
  if (!message) return null;
  const inset = FIELD_DESIGN[theme.design].label === FIELD_LABEL.floating;
  return (
    <Text
      accessibilityLiveRegion="polite"
      style={[
        textStyle(theme, 'sm'),
        styles.fieldMessage,
        { color: error ? theme.colors.danger : theme.colors.textSecondary, paddingStart: inset ? theme.spacing.md : 0 },
        style,
      ]}
    >
      {message}
    </Text>
  );
};
