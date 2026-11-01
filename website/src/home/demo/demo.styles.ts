import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  root: { flex: 1, height: '100%', paddingHorizontal: 14, paddingTop: 6, paddingBottom: 26 },
  header: { paddingHorizontal: 6, paddingBottom: 8, gap: 2 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.6 },
  subtitle: { fontSize: 13 },
  flag: { fontSize: 18 },
  browserRoot: { paddingTop: 20 },
  body: { flex: 1, gap: 12, paddingTop: 8, marginBottom: 12 },
  scroll: { flex: 1, marginBottom: 12 },
  scrollBody: { gap: 12, paddingTop: 8, paddingBottom: 8 },
  stage: { flex: 1, justifyContent: 'center' },
  pair: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  primaryButton: { height: 50, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  reserveDisabled: { opacity: 0.5 },
  reserveRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reserveProgress: { opacity: 0.22, transformOrigin: 'left' },
  primaryButtonText: { fontSize: 16, fontWeight: '700' },
});
