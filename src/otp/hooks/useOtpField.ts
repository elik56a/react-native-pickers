import { useCaretBlink } from '../../core/hooks/useCaretBlink';
import { useControllableState } from '../../core/hooks/useControllableState';
import { useFocus } from '../../core/hooks/useFocus';
import { DEFAULT_OTP_LENGTH, OTP_INPUT_MODE } from '../otp.constants';
import type { OtpFieldProps, OtpFieldState } from '../otp.types';
import { getCells, sanitizeCode } from '../otp.utils';

/** The code the cells show, and the handler that turns typing and pasting into it. `onComplete` fires when the user fills the last cell. */
export const useOtpField = ({
  length = DEFAULT_OTP_LENGTH,
  value,
  defaultValue = '',
  onChange,
  onComplete,
  inputMode = OTP_INPUT_MODE.numeric,
  secureTextEntry = false,
}: OtpFieldProps): OtpFieldState => {
  const [raw, setCode] = useControllableState(value, defaultValue, onChange);
  const code = sanitizeCode(raw, length, inputMode);
  const focus = useFocus();
  const cells = getCells(code, length, focus.focused, secureTextEntry);
  const caretOpacity = useCaretBlink(
    cells.some((cell) => cell.caret),
    code.length
  );

  const changeText = (text: string) => {
    const next = sanitizeCode(text, length, inputMode);
    if (next === code) return;
    setCode(next);
    if (next.length === length) onComplete?.(next);
  };

  return {
    code,
    length,
    cells,
    caretOpacity,
    changeText,
    onFocus: focus.onFocus,
    onBlur: focus.onBlur,
  };
};
