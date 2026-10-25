import { memo, useMemo } from 'react';
import { Animated, Pressable, Text } from 'react-native';

import { textStyle } from '../../core';
import { PERSPECTIVE } from '../wheel.constants';
import { styles } from '../wheel.styles';
import type { WheelRowProps } from '../wheel.types';
import { getRowFrames } from '../wheel.utils';

const WheelRowImpl = <T,>({
  dataIndex,
  logicalIndex,
  item,
  selected,
  itemHeight,
  visibleItems,
  scrollY,
  variant,
  rotation,
  fadeTo,
  theme,
  textAlign,
  slots,
  renderItem,
  onSelect,
}: WheelRowProps<T>) => {
  const animatedStyle = useMemo(() => {
    const frames = getRowFrames({ dataIndex, itemHeight, visibleItems, variant, rotation, fadeTo });
    const interpolate = <V extends number | string>(outputRange: V[]) =>
      scrollY.interpolate<V>({ inputRange: frames.inputRange, outputRange, extrapolate: 'clamp' });
    const opacity = interpolate(frames.opacity);
    const scale = interpolate(frames.scale);
    if (!frames.translateY || !frames.rotateX)
      return {
        opacity,
        transform: [{ scale }],
      };
    return {
      opacity,
      transform: [
        { perspective: PERSPECTIVE },
        { translateY: interpolate(frames.translateY) },
        { rotateX: interpolate(frames.rotateX) },
        { scale },
      ],
    };
  }, [dataIndex, fadeTo, itemHeight, rotation, scrollY, variant, visibleItems]);

  const color = item.disabled ? theme.colors.textDisabled : selected ? theme.colors.text : theme.colors.textSecondary;

  return (
    <Pressable onPress={onSelect && !item.disabled ? () => onSelect(dataIndex) : undefined} accessible={false}>
      <Animated.View style={[styles.row, { height: itemHeight, paddingHorizontal: theme.spacing.sm }, animatedStyle, slots?.item]}>
        {renderItem ? (
          renderItem({ item, index: logicalIndex, selected, theme })
        ) : (
          <Text
            numberOfLines={1}
            style={[
              textStyle(theme, 'lg', selected ? 'bold' : 'regular'),
              { textAlign, color },
              slots?.itemText,
              selected && slots?.selectedItemText,
              item.disabled && slots?.disabledItemText,
            ]}
          >
            {item.label}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
};

export const WheelRow = memo(WheelRowImpl) as typeof WheelRowImpl;
