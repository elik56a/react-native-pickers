import { Fragment } from 'react';
import { Text, View } from 'react-native';

import { textStyle, usePickerTheme } from '../core';
import { useDesignOverride } from '../core/theme/ThemeProvider';
import { WheelIndicator } from './components/WheelIndicator';
import { WheelPicker } from './WheelPicker';
import { DEFAULT_ITEM_HEIGHT, DEFAULT_VISIBLE_ITEMS, WHEEL_VARIANT } from './wheel.constants';
import { styles } from './wheel.styles';
import type { MultiWheelPickerProps } from './wheel.types';
import { resolveSeparator, toOddCount } from './wheel.utils';

/** Several wheels sharing one selection band (time, date, units...). */
export const MultiWheelPicker = ({
  columns,
  separator,
  itemHeight = DEFAULT_ITEM_HEIGHT,
  visibleItems = DEFAULT_VISIBLE_ITEMS,
  variant = WHEEL_VARIANT.threeD,
  style,
  styles: slots,
  theme: themeProp,
  design,
  testID,
}: MultiWheelPickerProps) => {
  const themeOverride = useDesignOverride(themeProp, design);
  const theme = usePickerTheme(themeOverride);
  const visible = toOddCount(visibleItems);
  return (
    <View style={[{ height: itemHeight * visible }, style, slots?.container]} testID={testID}>
      <WheelIndicator itemHeight={itemHeight} theme={theme} style={slots?.indicator} />
      <View style={styles.columns}>
        {columns.map(({ key, flex, width, suffix, styles: columnSlots, ...column }, i) => {
          const sep = resolveSeparator(separator, i);
          return (
            <Fragment key={key}>
              {sep !== null && (
                <View style={styles.separator} pointerEvents="none">
                  {typeof sep === 'string' ? <Text style={[textStyle(theme, 'lg', 'bold'), slots?.separator]}>{sep}</Text> : sep}
                </View>
              )}
              <WheelPicker
                {...column}
                theme={themeOverride}
                itemHeight={itemHeight}
                visibleItems={visible}
                variant={variant}
                showIndicator={false}
                style={[width !== undefined ? { width } : { flex: flex ?? 1 }, column.style]}
                styles={{
                  item: slots?.item,
                  itemText: slots?.itemText,
                  selectedItemText: slots?.selectedItemText,
                  disabledItemText: slots?.disabledItemText,
                  ...columnSlots,
                }}
              />
              {suffix ? (
                <View style={styles.separator} pointerEvents="none">
                  <Text style={[textStyle(theme, 'md'), { color: theme.colors.textSecondary }, slots?.separator]}>{suffix}</Text>
                </View>
              ) : null}
            </Fragment>
          );
        })}
      </View>
    </View>
  );
};
