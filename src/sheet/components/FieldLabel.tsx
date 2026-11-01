import { PickerText } from '../../core/components/PickerText';
import { FIELD_DESIGN, FIELD_LABEL, REQUIRED_MARK } from '../sheet.constants';
import { styles } from '../sheet.styles';
import type { FieldLabelProps } from '../sheet.types';

/** The label above a field; designs with a floating label draw it inside the field instead, unless a custom trigger replaces the field. */
export const FieldLabel = ({ label, invalid, required, customTrigger, theme, style }: FieldLabelProps) =>
  FIELD_DESIGN[theme.design].label === FIELD_LABEL.floating && !customTrigger ? null : (
    <PickerText theme={theme} size="sm" weight="medium" color={invalid ? 'danger' : 'textSecondary'} style={[styles.fieldLabel, style]}>
      {label}
      {required ? REQUIRED_MARK : null}
    </PickerText>
  );
