import { StyleSheet } from 'react-native';

import { CLOCK_FIELD, CLOCK_PERIOD_WIDTH, DIAL_CENTER_SIZE, DIAL_HAND_WIDTH, DIAL_NUMBER_SIZE, DIAL_SIZE } from './time.constants';

const CENTER = DIAL_SIZE / 2;

export const styles = StyleSheet.create({
  listRow: { paddingVertical: 0 },
  clock: { alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center' },
  field: { width: CLOCK_FIELD.width, height: CLOCK_FIELD.height, alignItems: 'center', justifyContent: 'center' },
  fieldText: { fontSize: CLOCK_FIELD.fontSize, lineHeight: CLOCK_FIELD.height },
  period: { width: CLOCK_PERIOD_WIDTH, height: CLOCK_FIELD.height, borderWidth: 1, overflow: 'hidden' },
  periodHalf: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  dial: { width: DIAL_SIZE, height: DIAL_SIZE, borderRadius: CENTER },
  hand: { position: 'absolute', width: DIAL_HAND_WIDTH, left: CENTER - DIAL_HAND_WIDTH / 2 },
  selector: {
    position: 'absolute',
    width: DIAL_NUMBER_SIZE,
    height: DIAL_NUMBER_SIZE,
    borderRadius: DIAL_NUMBER_SIZE / 2,
    left: CENTER - DIAL_NUMBER_SIZE / 2,
  },
  center: {
    position: 'absolute',
    width: DIAL_CENTER_SIZE,
    height: DIAL_CENTER_SIZE,
    borderRadius: DIAL_CENTER_SIZE / 2,
    left: CENTER - DIAL_CENTER_SIZE / 2,
    top: CENTER - DIAL_CENTER_SIZE / 2,
  },
  number: {
    position: 'absolute',
    width: DIAL_NUMBER_SIZE,
    height: DIAL_NUMBER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
