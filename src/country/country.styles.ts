import { StyleSheet } from 'react-native';

import { FLAG_SIZE } from './country.constants';

export const styles = StyleSheet.create({
  flag: { fontSize: FLAG_SIZE },
  phoneRow: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  phoneInput: { flex: 1, minWidth: 0, alignSelf: 'stretch' },
  countryButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch', gap: 4, borderEndWidth: StyleSheet.hairlineWidth },
});
