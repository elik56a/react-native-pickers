import { StyleSheet, type ViewStyle } from 'react-native';

import { DROPDOWN_MAX_HEIGHT } from '../sheet/sheet.constants';
import { SELECT_PRESENTATION } from './select.constants';
import type { SelectPresentation } from './select.types';

export const styles = StyleSheet.create({
  flex: { flex: 1 },
  option: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, marginVertical: 1 },
  icon: { alignItems: 'center', justifyContent: 'center' },
  description: { marginTop: 2 },
  groupHeaderText: { textTransform: 'uppercase', letterSpacing: 0.6 },
  checkBox: { borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  checkBoxMark: { fontSize: 13, fontWeight: '700', lineHeight: 16 },
  radio: { width: 20, height: 20, borderWidth: 2, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  empty: { alignItems: 'center' },
  loading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  searchField: { height: '100%' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingHorizontal: 10, paddingVertical: 4 },
  dropdownList: { flexShrink: 1 },
  sheetList: { flexGrow: 1, flexShrink: 1 },
  /** Inline, the list scrolls on its own instead of stretching the page. */
  inlineList: { maxHeight: DROPDOWN_MAX_HEIGHT },
});

export const LIST_STYLE: Record<SelectPresentation, ViewStyle> = {
  [SELECT_PRESENTATION.auto]: styles.sheetList,
  [SELECT_PRESENTATION.bottomSheet]: styles.sheetList,
  [SELECT_PRESENTATION.modal]: styles.sheetList,
  [SELECT_PRESENTATION.dropdown]: styles.dropdownList,
  [SELECT_PRESENTATION.inline]: styles.inlineList,
};
