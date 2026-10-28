import { StyleSheet } from 'react-native';

import { BESIDE_BORDER, BESIDE_CALENDAR_WIDTH, BESIDE_PADDING } from './datetime.constants';

export const styles = StyleSheet.create({
  calendarLayout: { gap: 12 },
  besideLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: BESIDE_PADDING,
    borderWidth: BESIDE_BORDER,
  },
  // A width, not a flex basis: browsers size a centred card from its children's widths and ignore their basis.
  besideCalendar: { width: BESIDE_CALENDAR_WIDTH, maxWidth: '100%' },
  besideTime: { borderWidth: 0 },
});
