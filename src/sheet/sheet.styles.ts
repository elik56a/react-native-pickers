import { StyleSheet } from 'react-native';

import { DIALOG_MARGIN, SHEET_MAX_WIDTH } from './sheet.constants';

export const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end' },
  dialogContainer: { flex: 1, justifyContent: 'center', padding: DIALOG_MARGIN },
  sheet: { width: '100%', alignSelf: 'center', maxWidth: SHEET_MAX_WIDTH, overflow: 'hidden' },
  dialogHeader: { paddingTop: 12 },
  handleArea: { alignItems: 'center', paddingTop: 8, paddingBottom: 6 },
  handle: { width: 40, height: 5, borderRadius: 3 },
  header: { flexDirection: 'row', alignItems: 'center', minHeight: 44, paddingBottom: 4 },
  headerSide: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  headerRight: { justifyContent: 'flex-end' },
  headerCenter: { flex: 2, alignItems: 'center' },
  flex: { flex: 1 },
  shrink: { flexShrink: 1 },
  button: { paddingVertical: 6 },
  dropdownOverlay: { position: 'absolute' },
  dropdown: { position: 'absolute', borderWidth: StyleSheet.hairlineWidth, paddingVertical: 6, overflow: 'hidden' },
  content: { paddingHorizontal: 16, paddingBottom: 8 },
  compactContent: { paddingHorizontal: 8 },
});
