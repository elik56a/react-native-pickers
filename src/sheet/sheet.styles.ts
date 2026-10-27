import { StyleSheet } from 'react-native';

import { DIALOG_MARGIN, SHEET_MAX_WIDTH } from './sheet.constants';

export const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end' },
  dialogContainer: { flex: 1, justifyContent: 'center', padding: DIALOG_MARGIN },
  sheetFrame: { width: '100%', alignSelf: 'center', maxWidth: SHEET_MAX_WIDTH },
  sheet: { width: '100%', overflow: 'hidden' },
  dialogHeader: { paddingTop: 12 },
  handleArea: { alignItems: 'center', paddingTop: 8, paddingBottom: 6 },
  handle: { width: 40, height: 5, borderRadius: 3 },
  header: { flexDirection: 'row', alignItems: 'center', minHeight: 44, paddingBottom: 4 },
  headerSide: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  headerRight: { justifyContent: 'flex-end' },
  headerCenter: { flex: 2, alignItems: 'center' },
  headerStart: { alignItems: 'flex-start' },
  flex: { flex: 1 },
  shrink: { flexShrink: 1 },
  /** Padded for a comfortable hover and ripple area; the negative margin keeps the label lined up with the edge. */
  button: { paddingVertical: 6, paddingHorizontal: 8, marginHorizontal: -8 },
  dropdownOverlay: { position: 'absolute' },
  dropdown: { position: 'absolute', borderWidth: StyleSheet.hairlineWidth, paddingVertical: 6, overflow: 'hidden' },
  dropdownScroll: { flexGrow: 0, flexShrink: 1 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 24 },
  dropdownFooter: {
    paddingTop: 8,
    paddingBottom: 2,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  content: { paddingHorizontal: 16, paddingBottom: 8 },
  compactContent: { paddingHorizontal: 8 },
  fieldLabel: { marginBottom: 6 },
  trigger: { flexDirection: 'row', alignItems: 'center', minHeight: 48, borderWidth: 1, paddingVertical: 6 },
  triggerRow: { flexDirection: 'row', alignItems: 'center' },
  triggerIcon: { marginEnd: 8 },
  clear: { paddingHorizontal: 6 },
  clearButton: { justifyContent: 'center' },
  chevron: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginStart: 4 },
  chevronMark: { width: 8, height: 8, borderRightWidth: 1.75, borderBottomWidth: 1.75, marginTop: -4, transform: [{ rotate: '45deg' }] },
});
