import { Text, View } from 'react-native';

import { textStyle } from '../../core';
import { Touchable } from '../../core/components/Touchable';
import { CHECK_MARK } from '../../core/core.constants';
import { DISABLED_ITEM_OPACITY, HORIZONTAL_LIST_VARIANT, LIST_DESIGN } from '../list.constants';
import { styles } from '../list.styles';
import type { ListItemProps } from '../list.types';

export const ListItem = <T,>({
  item,
  selected,
  divided,
  variant,
  renderItem,
  onPress,
  onLayout,
  theme,
  slots,
  testID,
}: ListItemProps<T>) => {
  const c = theme.colors;
  const disabled = !!item.disabled;
  const segmented = variant === HORIZONTAL_LIST_VARIANT.segmented;
  const { outlined } = LIST_DESIGN[theme.design];
  const background = segmented ? 'transparent' : selected ? c.primaryMuted : c.surface;
  const labelColor = outlined ? c.text : selected ? c.primary : segmented ? c.textSecondary : c.text;
  return (
    <View onLayout={(e) => onLayout(e.nativeEvent.layout)} style={segmented && styles.segmentSlot} testID={testID}>
      <Touchable
        theme={theme}
        disabled={disabled}
        onPress={onPress}
        accessibilityRole="radio"
        accessibilityState={{ checked: selected, disabled }}
        accessibilityLabel={item.label}
        style={[
          styles.item,
          segmented ? styles.segment : styles.chip,
          {
            gap: theme.spacing.xs,
            paddingHorizontal: theme.spacing.md,
            borderRadius: segmented ? theme.radius.sm : theme.radius.full,
            backgroundColor: background,
            opacity: disabled ? DISABLED_ITEM_OPACITY : 1,
          },
          outlined && { backgroundColor: selected ? c.primaryMuted : 'transparent', borderColor: c.textSecondary },
          outlined && segmented && [styles.outlinedSegment, { borderStartWidth: divided ? 1 : 0 }],
          outlined && !segmented && { borderRadius: theme.radius.sm, borderWidth: selected ? 0 : 1 },
          slots?.item,
          selected && slots?.selectedItem,
        ]}
      >
        {renderItem ? (
          renderItem({ item, selected, disabled, theme })
        ) : (
          <>
            {outlined && selected ? <Text style={[textStyle(theme, 'sm', 'bold'), { color: labelColor }]}>{CHECK_MARK}</Text> : item.icon}
            <Text
              numberOfLines={1}
              style={[
                textStyle(theme, 'sm', selected && !segmented ? 'bold' : 'medium'),
                { color: labelColor },
                slots?.itemLabel,
                selected && slots?.selectedItemLabel,
              ]}
            >
              {item.label}
            </Text>
          </>
        )}
      </Touchable>
    </View>
  );
};
