import type { Animated, StyleProp, ViewStyle } from 'react-native';

import type { PickerTheme, SlotStyles, ThemableProps } from '../core';
import type { ValueOf } from '../core/core.types';
import type { FieldDesign } from '../sheet/sheet.types';
import type { OTP_INPUT_MODE } from './otp.constants';

/** 'numeric': digits on a number pad. 'text': letters and digits. */
export type OtpInputMode = ValueOf<typeof OTP_INPUT_MODE>;

export type OtpFieldSlot = 'container' | 'cell' | 'focusedCell' | 'filledCell' | 'cellText' | 'caret';

export interface OtpFieldProps extends ThemableProps {
  /** How many characters the code has. Default: 6 */
  length?: number;
  value?: string;
  defaultValue?: string;
  /** As the user types, deletes or pastes, with the code so far */
  onChange?: (code: string) => void;
  /** Once the user fills the last cell, with the whole code */
  onComplete?: (code: string) => void;
  /** 'numeric': digits only, on a number pad. 'text': letters and digits. Default: 'numeric' */
  inputMode?: OtpInputMode;
  /** Each character shows as a dot, for a PIN. Default: false */
  secureTextEntry?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  /** What screen readers call the field. Default: 'Verification code' */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  styles?: SlotStyles<OtpFieldSlot>;
  /** On the text input; cell `i` gets `${testID}-cell-${i}` */
  testID?: string;
}

export interface OtpCellState {
  key: string;
  /** The character, or a dot with `secureTextEntry`; '' while empty */
  char: string;
  /** The field is focused and this cell takes the next character */
  focused: boolean;
  filled: boolean;
  /** The blinking caret: in the focused cell while it's empty */
  caret: boolean;
}

/** What `useOtpField` hands the field. Named so the build can emit the hook returning it. */
export interface OtpFieldState {
  code: string;
  length: number;
  cells: OtpCellState[];
  caretOpacity: Animated.Value;
  changeText: (text: string) => void;
  onFocus: () => void;
  onBlur: () => void;
}

export interface OtpCellProps {
  cell: OtpCellState;
  caretOpacity: Animated.Value;
  look: FieldDesign;
  theme: PickerTheme;
  slots?: SlotStyles<OtpFieldSlot>;
  testID?: string;
}
