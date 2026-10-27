import { Animated, ScrollView } from 'react-native';

import { usePickerTheme } from '../core';
import { ListItem } from './components/ListItem';
import { useHorizontalList } from './hooks/useHorizontalList';
import { useSegmentThumb } from './hooks/useSegmentThumb';
import { HORIZONTAL_LIST_VARIANT } from './list.constants';
import { styles } from './list.styles';
import type { HorizontalListProps } from './list.types';
import { findItemIndex } from './list.utils';

/** A row of choices that scrolls sideways. Pressing an item at the edge scrolls the next one into view, so the user sees there's more. */
export const HorizontalList = <T,>({
  items,
  value,
  onChange,
  isEqual = Object.is,
  variant = HORIZONTAL_LIST_VARIANT.segmented,
  renderItem,
  accessibilityLabel,
  style,
  styles: slots,
  theme: themeOverride,
  testID,
}: HorizontalListProps<T>) => {
  const theme = usePickerTheme(themeOverride);
  const list = useHorizontalList(onChange, theme.spacing.lg);
  const selectedIndex = findItemIndex(items, value, isEqual);
  const thumb = useSegmentThumb(selectedIndex, theme.animation.duration);
  const segmented = variant === HORIZONTAL_LIST_VARIANT.segmented;
  return (
    <ScrollView
      ref={list.scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      onLayout={list.onLayout}
      onContentSizeChange={list.onContentSizeChange}
      onScroll={list.onScroll}
      scrollEventThrottle={16}
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.list,
        segmented && [styles.track, { backgroundColor: theme.colors.border, borderRadius: theme.radius.md }],
        style,
        slots?.container,
      ]}
      contentContainerStyle={[styles.content, segmented ? styles.trackContent : { gap: theme.spacing.sm }, slots?.content]}
      testID={testID}
    >
      {segmented && thumb.placed ? (
        <Animated.View
          style={[styles.thumb, thumb.style, { backgroundColor: theme.colors.background, borderRadius: theme.radius.sm }, slots?.thumb]}
        />
      ) : null}
      {items.map((item, index) => (
        <ListItem
          key={item.label}
          item={item}
          selected={index === selectedIndex}
          variant={variant}
          renderItem={renderItem}
          onPress={() => list.press(item, index)}
          onLayout={(layout) => {
            list.onItemLayout(index, layout);
            thumb.onItemLayout(index, layout);
          }}
          theme={theme}
          slots={slots}
          testID={testID ? `${testID}-item-${index}` : undefined}
        />
      ))}
    </ScrollView>
  );
};
