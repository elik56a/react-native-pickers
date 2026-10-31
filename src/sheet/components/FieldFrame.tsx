import type { FieldFrameProps } from '../sheet.types';
import { FieldLabel } from './FieldLabel';
import { FieldMessage } from './FieldMessage';

/** What every field shares around its box: the label above, and the helper text or error message under it. */
export const FieldFrame = ({ label, error, helperText, required, theme, slots, children }: FieldFrameProps) => (
  <>
    {label ? <FieldLabel label={label} invalid={!!error} required={required} theme={theme} style={slots?.label} /> : null}
    {children}
    <FieldMessage error={error} helperText={helperText} theme={theme} style={slots?.helperText} />
  </>
);
