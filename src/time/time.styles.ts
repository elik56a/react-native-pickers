import { StyleSheet } from 'react-native';

import {
  CLOCK_FIELD,
  CLOCK_PERIOD_WIDTH,
  DIAL_CENTER_SIZE,
  DIAL_HAND_WIDTH,
  DIAL_NUMBER_SIZE,
  DIAL_SIZE,
  ENTRY_ICON_SIZE,
  ENTRY_TOGGLE_SIZE,
  TIME_CELL_HEIGHT,
  TIME_COLUMN_WIDTH,
} from './time.constants';

const CENTER = DIAL_SIZE / 2;

export const styles = StyleSheet.create({
  panel: { flexDirection: 'row', alignSelf: 'center', borderWidth: 1, padding: 4, overflow: 'hidden' },
  panelColumn: { width: TIME_COLUMN_WIDTH },
  cell: { height: TIME_CELL_HEIGHT - 4, marginVertical: 2, marginHorizontal: 4, alignItems: 'center', justifyContent: 'center' },
  clock: { alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center' },
  field: { width: CLOCK_FIELD.width, height: CLOCK_FIELD.height, alignItems: 'center', justifyContent: 'center' },
  fieldText: { fontSize: CLOCK_FIELD.fontSize, lineHeight: CLOCK_FIELD.height },
  fieldInput: {
    width: CLOCK_FIELD.width,
    height: CLOCK_FIELD.height,
    fontSize: CLOCK_FIELD.fontSize,
    borderWidth: 2,
    textAlign: 'center',
    padding: 0,
  },
  fieldColumn: { alignItems: 'center' },
  headerTop: { alignItems: 'flex-start' },
  entryToggle: {
    width: ENTRY_TOGGLE_SIZE,
    height: ENTRY_TOGGLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  clockIcon: { width: ENTRY_ICON_SIZE, height: ENTRY_ICON_SIZE, borderRadius: ENTRY_ICON_SIZE / 2, borderWidth: 2 },
  /** The clock icon's hand, from its centre up towards 12. */
  clockIconHand: { position: 'absolute', width: 2, height: ENTRY_ICON_SIZE / 2 - 4, left: ENTRY_ICON_SIZE / 2 - 3, top: 2 },
  keyboardIcon: { width: ENTRY_ICON_SIZE, height: (ENTRY_ICON_SIZE * 2) / 3, borderRadius: 3, borderWidth: 2, padding: 2, gap: 2 },
  keyboardKeys: { flex: 1, borderTopWidth: 2, borderStyle: 'dotted' },
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
