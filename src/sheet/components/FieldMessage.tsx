import { PickerText } from '../../core/components/PickerText';
import { FIELD_DESIGN, FIELD_LABEL } from '../sheet.constants';
import { styles } from '../sheet.styles';
import type { FieldMessageProps } from '../sheet.types';
import { getFieldMessage } from '../sheet.utils';

/** The line under a field: the error message, or the helper text. Announced as it changes. */
export const FieldMessage = ({ error, helperText, centered = false, theme, style }: FieldMessageProps) => {
  const message = getFieldMessage(error, helperText);
  if (!message) return null;
  const inset = !centered && FIELD_DESIGN[theme.design].label === FIELD_LABEL.floating;
  return (
    <PickerText
      theme={theme}
      size="sm"
      color={error ? 'danger' : 'textSecondary'}
      accessibilityLiveRegion="polite"
      style={[styles.fieldMessage, centered && styles.centeredMessage, { paddingStart: inset ? theme.spacing.md : 0 }, style]}
    >
      {message}
    </PickerText>
  );
};
