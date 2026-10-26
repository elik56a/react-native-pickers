import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  flex: { flex: 1 },
  option: { flexDirection: 'row', alignItems: 'center', minHeight: 48, paddingVertical: 10, marginVertical: 1 },
  icon: { alignItems: 'center', justifyContent: 'center' },
  description: { marginTop: 2 },
  groupHeaderText: { textTransform: 'uppercase', letterSpacing: 0.6 },
  checkBox: { width: 22, height: 22, borderWidth: 2, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  checkBoxMark: { fontSize: 13, fontWeight: '700', lineHeight: 16 },
  empty: { alignItems: 'center' },
  searchField: { height: '100%' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingHorizontal: 10, paddingVertical: 4 },
  dropdownList: { flexShrink: 1 },
  sheetList: { flexGrow: 1, flexShrink: 1 },
});
