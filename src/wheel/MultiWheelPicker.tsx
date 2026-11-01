import { Fragment } from 'react';
import { View } from 'react-native';

import { PickerText } from '../core/components/PickerText';
import { useComponentTheme } from '../core/theme/ThemeProvider';
import { ARROW_FOCUS } from '../core/utils/keyboard.utils';
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
  const { theme, themeOverride } = useComponentTheme(themeProp, design);
  const visible = toOddCount(visibleItems);
  return (
    <View style={[{ height: itemHeight * visible }, style, slots?.container]} {...ARROW_FOCUS} testID={testID}>
      <WheelIndicator itemHeight={itemHeight} theme={theme} style={slots?.indicator} />
      <View style={styles.columns}>
        {columns.map(({ key, flex, width, suffix, styles: columnSlots, ...column }, i) => {
          const sep = resolveSeparator(separator, i);
          return (
            <Fragment key={key}>
              {sep !== null && (
                <View style={styles.separator} pointerEvents="none">
                  {typeof sep === 'string' ? (
                    <PickerText theme={theme} size="lg" weight="bold" style={slots?.separator}>
                      {sep}
                    </PickerText>
                  ) : (
                    sep
                  )}
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
                  <PickerText theme={theme} color="textSecondary" style={slots?.separator}>
                    {suffix}
                  </PickerText>
                </View>
              ) : null}
            </Fragment>
          );
        })}
      </View>
    </View>
  );
};
