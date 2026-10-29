import { StyleSheet } from 'react-native';

import { KNOB_COLOR, KNOB_SHADOW, KNOB_SIZE, TOUCH_TARGET } from '../core/core.constants';
import { CHECKER_SIZE, PAD_THUMB_SIZE } from './color.constants';

/** The platforms' colour sliders ring the colour in white, so it shows on any colour. */
const thumb = {
  position: 'absolute',
  borderWidth: 3,
  borderColor: KNOB_COLOR,
  boxShadow: KNOB_SHADOW,
} as const;

export const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  column: { flexDirection: 'column' },
  center: { alignItems: 'center', justifyContent: 'center' },
  centerRow: { alignItems: 'center' },
  fill: { flex: 1 },
  swatches: { flexDirection: 'row', flexWrap: 'wrap' },
  swatchRow: { flexDirection: 'row' },
  swatch: { alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth },
  slider: { height: TOUCH_TARGET, justifyContent: 'center' },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  rail: { justifyContent: 'center' },
  track: { ...StyleSheet.absoluteFill, flexDirection: 'row', overflow: 'hidden' },
  sliderThumb: {
    ...thumb,
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    marginLeft: -KNOB_SIZE / 2,
  },
  pad: { overflow: 'hidden' },
  layer: { ...StyleSheet.absoluteFill },
  layerRow: { ...StyleSheet.absoluteFill, flexDirection: 'row' },
  layerColumn: { ...StyleSheet.absoluteFill, flexDirection: 'column' },
  halfTop: { position: 'absolute', top: 0, left: 0, right: 0, height: '50%', flexDirection: 'column' },
  halfBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', flexDirection: 'column' },
  padThumb: {
    ...thumb,
    width: PAD_THUMB_SIZE,
    height: PAD_THUMB_SIZE,
    borderRadius: PAD_THUMB_SIZE / 2,
    marginLeft: -PAD_THUMB_SIZE / 2,
    marginTop: -PAD_THUMB_SIZE / 2,
  },
  checker: { ...StyleSheet.absoluteFill, flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden' },
  checkerCell: { width: CHECKER_SIZE, height: CHECKER_SIZE },
  hexRow: { flexDirection: 'row', alignItems: 'center' },
  hexField: { flex: 1, justifyContent: 'center' },
  hexInput: { height: 40, borderWidth: 1 },
  hexButton: { position: 'absolute', end: 4, width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  preview: { width: 40, height: 40, borderWidth: StyleSheet.hairlineWidth },
  previewCircle: { width: 32, height: 32, borderRadius: 16, borderWidth: StyleSheet.hairlineWidth },
  previewLarge: { width: 56, height: 56, borderWidth: StyleSheet.hairlineWidth },
  iconButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  grid: { overflow: 'hidden' },
  gridCell: { flex: 1 },
  gridCellSelected: { borderWidth: 3, zIndex: 1 },
  fieldSwatch: { width: 20, height: 20, borderWidth: StyleSheet.hairlineWidth },
  copyIcon: { width: 14, height: 14 },
  copyBack: { position: 'absolute', top: 0, left: 0, width: 10, height: 10, borderWidth: 1.5, borderRadius: 2 },
  copyFront: { position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderWidth: 1.5, borderRadius: 2 },
  dropperIcon: { width: 16, height: 16, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '45deg' }] },
  dropperBulb: { width: 6, height: 6, borderRadius: 3 },
  dropperBody: { width: 4, height: 7, borderWidth: 1.5, borderTopWidth: 0 },
  dropperTip: { width: 1.5, height: 3 },
});
