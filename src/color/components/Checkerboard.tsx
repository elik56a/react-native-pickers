import { View } from 'react-native';

import { CHECKER_COLUMNS, CHECKER_DARK, CHECKER_LIGHT } from '../color.constants';
import { styles } from '../color.styles';

const CELLS = Array.from({ length: CHECKER_COLUMNS * 2 }, (_, i) => ({
  key: `cell-${i}`,
  dark: (i + Math.floor(i / CHECKER_COLUMNS)) % 2 === 1,
}));

/** The grey and white checks that show through a see-through colour; two rows, cut to the track. */
export const Checkerboard = () => (
  <View style={styles.checker} pointerEvents="none">
    {CELLS.map(({ key, dark }) => (
      <View key={key} style={[styles.checkerCell, { backgroundColor: dark ? CHECKER_DARK : CHECKER_LIGHT }]} />
    ))}
  </View>
);
