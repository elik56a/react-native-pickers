import { StyleSheet } from 'react-native';

import { GROUP_GAP } from './action.constants';

export const styles = StyleSheet.create({
  groupedSheet: { backgroundColor: 'transparent', paddingHorizontal: GROUP_GAP },
  group: { flexShrink: 1, overflow: 'hidden' },
  cancelGroup: { marginTop: GROUP_GAP },
  list: { flexGrow: 0 },
  header: { gap: 4 },
  groupedHeader: { alignItems: 'center' },
  centered: { textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  groupedRow: { justifyContent: 'center' },
  separator: { borderTopWidth: StyleSheet.hairlineWidth },
  text: { flex: 1 },
  groupedText: { alignItems: 'center' },
  groupedCheck: { position: 'absolute' },
});
