import { Pressable, Text, View } from 'react-native';

import { textStyle } from '../../core';
import { styles } from '../calendar.styles';
import type { QuickGridProps } from '../calendar.types';
import { chunkRows } from '../calendar.utils';

/** The 4×3 month or year grid shown after tapping the title. */
export const QuickGrid = ({ cells, height, onSelect, theme, slots }: QuickGridProps) => (
  <View style={[styles.quickGrid, { height, paddingHorizontal: theme.spacing.sm }]}>
    {chunkRows(cells).map((row) => (
      <View key={row[0]?.key} style={styles.week}>
        {row.map((cell) => (
          <Pressable
            key={cell.key}
            onPress={cell.disabled ? undefined : () => onSelect(cell.value)}
            style={({ pressed }) => [
              styles.quickCell,
              {
                borderRadius: theme.radius.full,
                backgroundColor: cell.selected ? theme.colors.primary : pressed ? theme.colors.surface : 'transparent',
              },
              slots?.gridCell,
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: cell.selected, disabled: cell.disabled }}
          >
            <Text
              style={[
                textStyle(theme, 'md', cell.selected ? 'bold' : 'regular'),
                { color: cell.selected ? theme.colors.onPrimary : cell.disabled ? theme.colors.textDisabled : theme.colors.text },
                slots?.gridCellText,
              ]}
            >
              {cell.label}
            </Text>
          </Pressable>
        ))}
      </View>
    ))}
  </View>
);
