import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end' },
  sheet: { width: '100%', alignSelf: 'center', maxWidth: 640, overflow: 'hidden' },
  handleArea: { alignItems: 'center', paddingTop: 8, paddingBottom: 6 },
  handle: { width: 40, height: 5, borderRadius: 3 },
  header: { flexDirection: 'row', alignItems: 'center', minHeight: 44, paddingBottom: 4 },
  headerSide: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  headerRight: { justifyContent: 'flex-end' },
  headerCenter: { flex: 2, alignItems: 'center' },
  flex: { flex: 1 },
  shrink: { flexShrink: 1 },
  button: { paddingVertical: 6 },
  content: { paddingHorizontal: 16, paddingBottom: 8 },
  compactContent: { paddingHorizontal: 8 },
});
