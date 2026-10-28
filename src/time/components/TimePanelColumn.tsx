import { FlatList, Text, View } from 'react-native';

import { textStyle } from '../../core';
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
        <Text
          style={[textStyle(theme, 'sm'), styles.panelHeader, { color: c.textSecondary }]}
          accessibilityElementsHidden
          importantForAccessibility="no"
        >
          {column.suffix}
        </Text>
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
              <Text
                style={[
                  textStyle(theme, 'md', selected ? 'bold' : 'regular'),
                  { color: selected ? c.onPrimary : item.disabled ? c.textDisabled : c.text },
                ]}
              >
                {item.label}
              </Text>
            </Touchable>
          );
        }}
      />
    </View>
  );
};
