import { ScrollView, Text, View } from 'react-native';

import { textStyle } from '../../core';
import { Touchable } from '../../core/components/Touchable';
import { CUSTOM_PLUS, SWATCH_CHECK } from '../color.constants';
import { styles } from '../color.styles';
import type { SwatchGridProps } from '../color.types';
import { getCheckColor, isSwatch, toSwatchCells } from '../color.utils';

const CUSTOM_KEY = 'custom';

/** Your swatches at the design's size, wrapping to fill the width (or in one row to scroll); Material adds a Custom circle at the end. */
export const SwatchGrid = ({ colors, shape, size, scroll = false, selected, onSelect, custom, theme, slots, testID }: SwatchGridProps) => {
  const radius = shape === 'circle' ? size / 2 : theme.radius.sm;
  const customChosen = !!custom && !isSwatch(colors, selected);
  const cells = toSwatchCells(colors);
  const all = custom ? [...cells, { key: CUSTOM_KEY, value: selected, label: custom.label }] : cells;
  const swatches = all.map(({ key, value, label }) => {
    const isCustom = key === CUSTOM_KEY;
    const chosen = isCustom ? customChosen : value === selected;
    return (
      <Touchable
        key={key}
        theme={theme}
        onPress={isCustom ? custom?.onPress : () => onSelect(value)}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={isCustom ? { expanded: custom?.open, selected: chosen } : { selected: chosen }}
        style={[
          styles.swatch,
          {
            width: size,
            height: size,
            borderRadius: radius,
            borderColor: theme.colors.border,
            backgroundColor: isCustom && !customChosen ? theme.colors.surface : value,
          },
          slots?.swatch,
        ]}
      >
        {chosen ? (
          <Text style={[textStyle(theme, size < 28 ? 'xs' : 'md', 'bold'), { color: getCheckColor(value) }]}>{SWATCH_CHECK}</Text>
        ) : isCustom ? (
          <Text style={[textStyle(theme, 'lg'), { color: theme.colors.textSecondary }]}>{CUSTOM_PLUS}</Text>
        ) : null}
      </Touchable>
    );
  });
  const gap = { gap: theme.spacing.sm };
  return scroll ? (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.swatchRow, gap]} testID={testID}>
      {swatches}
    </ScrollView>
  ) : (
    <View style={[styles.swatches, gap]} testID={testID}>
      {swatches}
    </View>
  );
};
