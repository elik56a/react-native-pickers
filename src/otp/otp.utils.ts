import { OTP_DROPPED_CHARS, SECURE_DOT } from './otp.constants';
import type { OtpCellState, OtpInputMode } from './otp.types';

/** The code in what was typed or pasted: only the characters the mode allows, at most `length` of them. */
export const sanitizeCode = (text: string, length: number, mode: OtpInputMode) =>
  text.replace(OTP_DROPPED_CHARS[mode], '').slice(0, length);

/** One cell per character. The focused one is the next to fill, or the last once the code is complete. */
export const getCells = (code: string, length: number, focused: boolean, secure: boolean): OtpCellState[] => {
  const next = Math.min(code.length, length - 1);
  return Array.from({ length }, (_, i) => {
    const char = code[i] ?? '';
    const isFocused = focused && i === next;
    return {
      key: String(i),
      char: char && secure ? SECURE_DOT : char,
      focused: isFocused,
      filled: char !== '',
      caret: isFocused && char === '',
    };
  });
};
