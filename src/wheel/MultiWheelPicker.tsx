import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { textStyle, usePickerTheme } from '../theme';
import type { SlotStyles, ThemableProps } from '../types';
import { WheelPicker } from './WheelPicker';
import type { WheelPickerProps, WheelPickerSlot } from './WheelPicker';

export type WheelColumn<T = any> = Omit<WheelPickerProps<T>, 'itemHeight' | 'visibleItems' | 'variant' | 'showIndicator' | 'theme'> & {
  key: string;
  /** Flex weight of the column. Default: 1 */
  flex?: number;
  /** Fixed column width */
  width?: number;
};

export type MultiWheelSlot = 'container' | 'indicator' | 'separator' | WheelPickerSlot;

export interface MultiWheelPickerProps extends ThemableProps {
  columns: WheelColumn[];
  /** Text/node rendered between columns, e.g. ':' for time */
  separator?: React.ReactNode | ((leftIndex: number) => React.ReactNode);
  itemHeight?: number;
  visibleItems?: number;
  variant?: '3d' | 'flat';
  style?: StyleProp<ViewStyle>;
  styles?: SlotStyles<MultiWheelSlot>;
  testID?: string;
}

/** Several wheels sharing one selection band (time, date, units...). */
export function MultiWheelPicker({
  columns,
  separator,
  itemHeight = 40,
  visibleItems = 5,
  variant = '3d',
  style,
  styles: slots,
  theme: themeOverride,
  testID,
}: MultiWheelPickerProps) {
  const theme = usePickerTheme(themeOverride);
  const vis = visibleItems % 2 === 0 ? visibleItems + 1 : visibleItems;
  return (
    <View style={[{ height: itemHeight * vis }, style, slots?.container]} testID={testID}>
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { justifyContent: 'center' }]}>
        <View
          style={[
            { height: itemHeight, borderRadius: theme.radius.md, backgroundColor: theme.colors.indicator, marginHorizontal: theme.spacing.xs },
            slots?.indicator,
          ]}
        />
      </View>
      <View style={s.row}>
        {columns.map(({ key, flex, width, styles: colSlots, ...col }, i) => {
          const sep = i > 0 && separator !== undefined ? (typeof separator === 'function' ? separator(i - 1) : separator) : null;
          return (
            <React.Fragment key={key}>
              {sep !== null && sep !== undefined && sep !== false ? (
                <View style={s.sep} pointerEvents="none">
                  {typeof sep === 'string' ? (
                    <Text style={[textStyle(theme, 'lg', 'bold'), slots?.separator]}>{sep}</Text>
                  ) : (
                    sep
                  )}
                </View>
              ) : null}
              <WheelPicker
                {...col}
                theme={themeOverride}
                itemHeight={itemHeight}
                visibleItems={vis}
                variant={variant}
                showIndicator={false}
                style={[width !== undefined ? { width } : { flex: flex ?? 1 }, col.style]}
                styles={{
                  item: slots?.item,
                  itemText: slots?.itemText,
                  selectedItemText: slots?.selectedItemText,
                  disabledItemText: slots?.disabledItemText,
                  ...colSlots,
                }}
              />
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', flex: 1 },
  sep: { justifyContent: 'center', paddingHorizontal: 2 },
});
