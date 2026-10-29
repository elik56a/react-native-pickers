import { useState } from 'react';
import { Text, View } from 'react-native';

import { OtpField, PhoneField, usePickerTheme } from '@elik56a/react-native-pickers';
import { ActionButton } from '../../home/demo/components/ActionButton';
import { AppScreen } from '../../home/demo/components/AppScreen';
import { deviceSheetProps } from '../../home/demo/demo.utils';
import { VERIFY } from '../showcase.constants';
import { styles } from '../showcase.styles';
import type { ScreenProps } from '../showcase.types';

export const VerifyScreen = ({ platform, screenHeight }: ScreenProps) => {
  const { colors } = usePickerTheme();
  const [phone, setPhone] = useState<string>(VERIFY.phone);
  const [code, setCode] = useState('');
  const verified = code.length === VERIFY.codeLength;
  return (
    <AppScreen
      platform={platform}
      title="Verify your phone"
      subtitle={verified ? 'Code accepted ✓' : 'We text you a 6-digit code'}
      action={
        <ActionButton label={verified ? 'Continue' : 'Enter the code'} busyLabel="Checking…" doneLabel="✓ Verified" disabled={!verified} />
      }
    >
      <PhoneField
        label="Mobile number"
        value={phone}
        onChange={setPhone}
        sheet={{ sheetProps: deviceSheetProps(platform, screenHeight) }}
      />
      <View style={styles.setting}>
        <Text style={[styles.settingLabel, { color: colors.text }]}>Code</Text>
        <OtpField length={VERIFY.codeLength} value={code} onChange={setCode} />
      </View>
      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        Any {VERIFY.codeLength} digits work here. Try pasting “Your code is 482-913”.
      </Text>
    </AppScreen>
  );
};
