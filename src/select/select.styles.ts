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
  label: { marginBottom: 6 },
  trigger: { flexDirection: 'row', alignItems: 'center', minHeight: 48, borderWidth: 1, paddingVertical: 6 },
  row: { flexDirection: 'row', alignItems: 'center' },
  searchField: { height: '100%' },
  triggerIcon: { marginEnd: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingHorizontal: 10, paddingVertical: 4 },
  clear: { paddingHorizontal: 6 },
  chevron: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginStart: 4 },
  chevronMark: { width: 8, height: 8, borderRightWidth: 1.75, borderBottomWidth: 1.75, marginTop: -4, transform: [{ rotate: '45deg' }] },
  dropdownList: { flexShrink: 1 },
});
