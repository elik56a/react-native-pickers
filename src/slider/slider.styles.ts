import { StyleSheet } from 'react-native';

import { KNOB_COLOR, KNOB_SHADOW, TOUCH_TARGET } from '../core/core.constants';
import {
  MARK_LABEL_BOX_WIDTH,
  MARK_LABEL_OFFSET,
  SLIDER_DISABLED_OPACITY,
  VALUE_LABEL_BOX_WIDTH,
  VALUE_LABEL_SPACE,
} from './slider.constants';

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  disabled: { opacity: SLIDER_DISABLED_OPACITY },
  noCursor: { cursor: 'auto' },
  column: { flex: 1 },
  reserveValueLabel: { paddingTop: VALUE_LABEL_SPACE },
  track: { height: TOUCH_TARGET, cursor: 'pointer' },
  markLabels: { marginTop: MARK_LABEL_OFFSET, minHeight: 20 },
  markLabelBox: { position: 'absolute', width: MARK_LABEL_BOX_WIDTH, alignItems: 'center' },
  rail: { position: 'absolute', start: 0, end: 0 },
  segment: { position: 'absolute', top: 0, bottom: 0 },
  mark: { position: 'absolute' },
  thumb: { position: 'absolute' },
  halo: { position: 'absolute' },
  knob: { backgroundColor: KNOB_COLOR, boxShadow: KNOB_SHADOW },
  valueLabelBox: { position: 'absolute', width: VALUE_LABEL_BOX_WIDTH, alignItems: 'center' },
  valueLabel: { paddingHorizontal: 12, paddingVertical: 6 },
});
