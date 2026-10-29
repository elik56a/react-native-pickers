import { StyleSheet } from 'react-native';

import { TOUCH_TARGET } from '../core/core.constants';
import { RATING_DISABLED_OPACITY } from './rating.constants';

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', minHeight: TOUCH_TARGET },
  pointer: { cursor: 'pointer' },
  disabled: { opacity: RATING_DISABLED_OPACITY },
  fill: { position: 'absolute', top: 0, bottom: 0, start: 0, overflow: 'hidden' },
  glyph: { textAlign: 'center', includeFontPadding: false },
});
