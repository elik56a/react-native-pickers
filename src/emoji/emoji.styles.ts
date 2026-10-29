import { StyleSheet } from 'react-native';

import { SECTION_HEADER_HEIGHT } from './emoji.constants';

export const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row' },
  header: { flexDirection: 'row', alignItems: 'center' },
  toneButton: { alignItems: 'center', justifyContent: 'center' },
  toneButtonText: { fontSize: 20 },
  toneMenu: { flexDirection: 'row', justifyContent: 'space-around', padding: 4, marginTop: 6 },
  toneOption: { padding: 6 },
  toneOptionText: { fontSize: 22 },
  tonePopover: { position: 'absolute', flexDirection: 'row', borderWidth: StyleSheet.hairlineWidth },
  bar: { flexDirection: 'row', marginTop: 6 },
  barTop: { borderBottomWidth: StyleSheet.hairlineWidth },
  barBottom: { borderTopWidth: StyleSheet.hairlineWidth },
  tab: { flex: 1, height: 40, alignItems: 'center', justifyContent: 'center' },
  markedBar: { paddingHorizontal: 4 },
  markedTab: { height: 32, marginVertical: 4 },
  tabIcon: { fontSize: 18 },
  tabIndicator: { position: 'absolute', left: '25%', right: '25%', height: 2.5, borderRadius: 2 },
  tabIndicatorTop: { bottom: 0 },
  tabIndicatorBottom: { top: 0 },
  uppercase: { textTransform: 'uppercase' },
  sectionHeader: { height: SECTION_HEADER_HEIGHT, justifyContent: 'flex-end', paddingHorizontal: 4, paddingBottom: 6 },
  cell: { alignItems: 'center', justifyContent: 'center' },
  cellPressed: { transform: [{ scale: 1.15 }] },
  empty: { alignItems: 'center' },
});
