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
});
