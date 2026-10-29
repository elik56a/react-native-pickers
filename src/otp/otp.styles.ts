import { StyleSheet } from 'react-native';

import { CARET_WIDTH, NO_ZOOM_FONT_SIZE, OTP_CELL_MAX_WIDTH } from './otp.constants';

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center' },
  cell: { flex: 1, maxWidth: OTP_CELL_MAX_WIDTH, alignItems: 'center', justifyContent: 'center' },
  caret: { width: CARET_WIDTH },
  // Over the cells, so a tap anywhere focuses it and a long press offers to paste; the cells draw what it holds.
  input: { ...StyleSheet.absoluteFill, opacity: 0, fontSize: NO_ZOOM_FONT_SIZE },
});
