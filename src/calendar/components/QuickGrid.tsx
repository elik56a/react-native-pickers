import { View } from 'react-native';

import { PickerText } from '../../core/components/PickerText';
import { Touchable } from '../../core/components/Touchable';
import { styles } from '../calendar.styles';
import type { QuickGridProps } from '../calendar.types';
import { chunkRows } from '../calendar.utils';

/** The 4×3 month or year grid shown after tapping the title. */
export const QuickGrid = ({ cells, height, onSelect, theme, slots }: QuickGridProps) => (
  <View style={[styles.quickGrid, { height, paddingHorizontal: theme.spacing.sm }]}>
    {chunkRows(cells).map((row) => (
      <View key={row[0]?.key} style={styles.week}>
        {row.map((cell) => (
          <Touchable
            key={cell.key}
            theme={theme}
            disabled={cell.disabled}
            onPress={() => onSelect(cell.value)}
            style={[
              styles.quickCell,
              {
                borderRadius: theme.radius.full,
                backgroundColor: cell.selected ? theme.colors.primary : 'transparent',
              },
              slots?.gridCell,
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: cell.selected, disabled: cell.disabled }}
          >
            <PickerText
              theme={theme}
              weight={cell.selected ? 'bold' : 'regular'}
              color={cell.selected ? 'onPrimary' : cell.disabled ? 'textDisabled' : 'text'}
              style={slots?.gridCellText}
            >
              {cell.label}
            </PickerText>
          </Touchable>
        ))}
      </View>
    ))}
  </View>
);
