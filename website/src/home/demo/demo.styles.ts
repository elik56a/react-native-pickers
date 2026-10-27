import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  root: { flex: 1, height: '100%', paddingHorizontal: 14, paddingTop: 6, paddingBottom: 26 },
  header: { paddingHorizontal: 6, paddingBottom: 8, gap: 2 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.6 },
  subtitle: { fontSize: 13 },
  body: { flex: 1, justifyContent: 'center' },
  form: { flex: 1, gap: 16, paddingTop: 12 },
  flag: { fontSize: 18 },
  tabBar: { marginTop: 8 },
  browserRoot: { paddingTop: 20 },
  booking: { flex: 1, gap: 14, paddingTop: 10 },
  reserve: { height: 50, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  reserveDisabled: { opacity: 0.5 },
  reserveRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reserveProgress: { opacity: 0.22, transformOrigin: 'left' },
  reserveText: { fontSize: 16, fontWeight: '700' },
});
