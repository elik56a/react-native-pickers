import { Text, View } from 'react-native';

import { textStyle } from '../../core';
import { Touchable } from '../../core/components/Touchable';
import { DISABLED_ITEM_OPACITY, HORIZONTAL_LIST_VARIANT } from '../list.constants';
import { styles } from '../list.styles';
import type { ListItemProps } from '../list.types';

export const ListItem = <T,>({ item, selected, variant, renderItem, onPress, onLayout, theme, slots, testID }: ListItemProps<T>) => {
  const disabled = !!item.disabled;
  const segmented = variant === HORIZONTAL_LIST_VARIANT.segmented;
  const chipBackground = selected ? theme.colors.primaryMuted : theme.colors.surface;
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
            backgroundColor: segmented ? 'transparent' : chipBackground,
            opacity: disabled ? DISABLED_ITEM_OPACITY : 1,
          },
          slots?.item,
          selected && slots?.selectedItem,
        ]}
      >
        {renderItem ? (
          renderItem({ item, selected, disabled, theme })
        ) : (
          <>
            {item.icon}
            <Text
              numberOfLines={1}
              style={[
                textStyle(theme, 'sm', selected && !segmented ? 'bold' : 'medium'),
                { color: selected ? theme.colors.primary : segmented ? theme.colors.textSecondary : theme.colors.text },
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
