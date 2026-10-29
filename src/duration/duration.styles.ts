import { StyleSheet } from 'react-native';

import { DURATION_FIELD_MIN_WIDTH } from './duration.constants';

export const styles = StyleSheet.create({
  input: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  // Three boxes are wider than a phone, so they shrink to fit.
  inputUnit: { flexDirection: 'row', alignItems: 'center', flexShrink: 1, minWidth: 0 },
  field: { flexShrink: 1, minWidth: DURATION_FIELD_MIN_WIDTH },
});
