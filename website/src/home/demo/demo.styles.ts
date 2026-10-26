import { StyleSheet } from 'react-native';

import { SEGMENTED_PADDING } from './demo.constants';

export const styles = StyleSheet.create({
  root: { flex: 1, height: '100%', paddingHorizontal: 14, paddingTop: 6, paddingBottom: 26 },
  header: { paddingHorizontal: 6, paddingBottom: 8, gap: 2 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.6 },
  subtitle: { fontSize: 13 },
  body: { flex: 1, justifyContent: 'center' },
  form: { flex: 1, gap: 16, paddingTop: 12 },
  flag: { fontSize: 18 },
  segmented: { flexDirection: 'row', borderRadius: 999, padding: SEGMENTED_PADDING, marginTop: 8 },
  pill: { position: 'absolute', top: SEGMENTED_PADDING, bottom: SEGMENTED_PADDING, left: SEGMENTED_PADDING, borderRadius: 999 },
  segment: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 999 },
  segmentLabel: { fontSize: 12, fontWeight: '600' },
});
