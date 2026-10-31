import { TextInput, View } from 'react-native';

import { usePickerTheme } from '../core';
import { coreStyles } from '../core/core.styles';
import { useDesignOverride } from '../core/theme/ThemeProvider';
import { FieldFrame } from '../sheet/components/FieldFrame';
import { DISABLED_TRIGGER_OPACITY, FIELD_DESIGN } from '../sheet/sheet.constants';
import { getFieldAccessibility } from '../sheet/sheet.utils';
import { OtpCell } from './components/OtpCell';
import { useOtpField } from './hooks/useOtpField';
import { DEFAULT_OTP_LABEL, OTP_AUTO_COMPLETE, OTP_INPUT_MODE } from './otp.constants';
import { styles } from './otp.styles';
import type { OtpFieldProps } from './otp.types';

/** A one-time code in a box per character. One text field underneath takes typing, pasting and the code the OS reads from a text message. */
export const OtpField = (props: OtpFieldProps) => {
  const {
    inputMode = OTP_INPUT_MODE.numeric,
    secureTextEntry = false,
    autoFocus,
    disabled = false,
    error,
    helperText,
    accessibilityLabel = DEFAULT_OTP_LABEL,
    style,
    styles: slots,
    theme: themeProp,
    design,
    testID,
  } = props;
  const theme = usePickerTheme(useDesignOverride(themeProp, design));
  const otp = useOtpField(props);
  const look = FIELD_DESIGN[theme.design];

  return (
    <View style={[{ opacity: disabled ? DISABLED_TRIGGER_OPACITY : 1 }, style]}>
      <FieldFrame error={error} helperText={helperText} centered theme={theme} slots={slots}>
        <View
          style={[styles.row, { gap: theme.spacing.sm }, slots?.container]}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {otp.cells.map((cell) => (
            <OtpCell
              key={cell.key}
              cell={cell}
              caretOpacity={otp.caretOpacity}
              invalid={!!error}
              look={look}
              theme={theme}
              slots={slots}
              testID={testID ? `${testID}-cell-${cell.key}` : undefined}
            />
          ))}
        </View>
      </FieldFrame>
      <TextInput
        value={otp.code}
        onChangeText={otp.changeText}
        onFocus={otp.onFocus}
        onBlur={otp.onBlur}
        maxLength={otp.length}
        keyboardType={inputMode === OTP_INPUT_MODE.numeric ? 'number-pad' : 'default'}
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="oneTimeCode"
        autoComplete={OTP_AUTO_COMPLETE}
        secureTextEntry={secureTextEntry}
        autoFocus={autoFocus}
        editable={!disabled}
        {...getFieldAccessibility({ name: accessibilityLabel, error })}
        style={[styles.input, coreStyles.noOutline]}
        testID={testID}
      />
    </View>
  );
};
