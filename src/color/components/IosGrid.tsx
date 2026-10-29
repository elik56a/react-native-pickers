import { View } from 'react-native';

import type { PickerTheme } from '../../core';
import { Touchable } from '../../core/components/Touchable';
import { IOS_GRID_CELL_HEIGHT, THUMB_RING } from '../color.constants';
import { styles } from '../color.styles';
import { getIosGridColors } from '../color.utils';

const GRID = getIosGridColors();

/** iOS's grid: one block of colours without gaps, the chosen one ringed in white. */
export const IosGrid = ({ selected, onSelect, theme }: { selected: string; onSelect: (color: string) => void; theme: PickerTheme }) => (
  <View style={[styles.grid, { borderRadius: theme.radius.md }]}>
    {GRID.map((row) => (
      <View key={row.join()} style={styles.row}>
        {row.map((color) => {
          const chosen = color === selected;
          return (
            <Touchable
              key={color}
              theme={theme}
              ripple={false}
              onPress={() => onSelect(color)}
              accessibilityRole="button"
              accessibilityLabel={color}
              accessibilityState={{ selected: chosen }}
              style={[
                styles.gridCell,
                { height: IOS_GRID_CELL_HEIGHT, backgroundColor: color },
                chosen && [styles.gridCellSelected, { borderColor: THUMB_RING }],
              ]}
            />
          );
        })}
      </View>
    ))}
  </View>
);
