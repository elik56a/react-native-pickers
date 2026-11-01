import { FlatList, View } from 'react-native';

import { PickerText } from '../../core/components/PickerText';
import { Touchable } from '../../core/components/Touchable';
import { useTimePanelColumn } from '../hooks/useTimePanelColumn';
import { TIME_CELL_HEIGHT } from '../time.constants';
import { styles } from '../time.styles';
import type { TimePanelColumnProps } from '../time.types';
import { getPanelCellLabel } from '../time.utils';

/** One column of a time panel: hours, minutes, seconds or AM/PM, each a cell to click, under its unit when it has one. */
export const TimePanelColumn = ({ column, visibleRows, theme }: TimePanelColumnProps) => {
  const c = theme.colors;
  const list = useTimePanelColumn(column, visibleRows);
  return (
    <View style={styles.panelColumn}>
      {column.suffix ? (
        <PickerText
          theme={theme}
          size="sm"
          color="textSecondary"
          style={styles.panelHeader}
          accessibilityElementsHidden
          importantForAccessibility="no"
        >
          {column.suffix}
        </PickerText>
      ) : null}
      <FlatList
        ref={list.ref}
        data={list.items}
        keyExtractor={(item) => String(item.value)}
        getItemLayout={list.getItemLayout}
        initialScrollIndex={list.initialIndex}
        showsVerticalScrollIndicator={false}
        style={[styles.panelList, { height: TIME_CELL_HEIGHT * visibleRows }]}
        testID={column.testID}
        renderItem={({ item }) => {
          const selected = item.value === list.selected;
          return (
            <Touchable
              theme={theme}
              disabled={item.disabled}
              onPress={() => column.onChange(item.value)}
              accessibilityRole="button"
              accessibilityLabel={getPanelCellLabel(column, item.label)}
              accessibilityState={{ selected, disabled: item.disabled }}
              style={[styles.cell, { borderRadius: theme.radius.sm, backgroundColor: selected ? c.primary : 'transparent' }]}
            >
              <PickerText
                theme={theme}
                weight={selected ? 'bold' : 'regular'}
                color={selected ? 'onPrimary' : item.disabled ? 'textDisabled' : 'text'}
              >
                {item.label}
              </PickerText>
            </Touchable>
          );
        }}
      />
    </View>
  );
};
