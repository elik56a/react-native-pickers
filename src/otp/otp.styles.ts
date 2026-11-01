import { StyleSheet } from 'react-native';

import { OTP_CELL_MAX_WIDTH } from './otp.constants';

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center' },
  cell: { flex: 1, maxWidth: OTP_CELL_MAX_WIDTH, alignItems: 'center', justifyContent: 'center' },
});
