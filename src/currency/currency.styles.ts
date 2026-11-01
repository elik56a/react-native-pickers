import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  row: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4 },
  input: { flex: 1, minWidth: 0, alignSelf: 'stretch' },
  currencyButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch', gap: 4, borderEndWidth: StyleSheet.hairlineWidth },
  pill: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', gap: 4 },
  largeLabel: { textAlign: 'center' },
  amountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});
