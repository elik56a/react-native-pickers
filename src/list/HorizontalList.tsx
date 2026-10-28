import { Animated, ScrollView } from 'react-native';

import { usePickerTheme } from '../core';
import { useDesignOverride } from '../core/theme/ThemeProvider';
import { ListItem } from './components/ListItem';
import { useHorizontalList } from './hooks/useHorizontalList';
import { useSegmentThumb } from './hooks/useSegmentThumb';
import { HORIZONTAL_LIST_VARIANT, ICON_POSITION, LIST_DESIGN } from './list.constants';
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
  iconPosition = ICON_POSITION.left,
  renderItem,
  accessibilityLabel,
  style,
  styles: slots,
  theme: themeProp,
  design,
  testID,
}: HorizontalListProps<T>) => {
  const themeOverride = useDesignOverride(themeProp, design);
  const theme = usePickerTheme(themeOverride);
  const list = useHorizontalList(onChange, theme.spacing.lg);
  const selectedIndex = findItemIndex(items, value, isEqual);
  const thumb = useSegmentThumb(selectedIndex, theme.animation.duration);
  const segmented = variant === HORIZONTAL_LIST_VARIANT.segmented;
  const { outlined } = LIST_DESIGN[theme.design];
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
        segmented &&
          (outlined
            ? [styles.track, styles.outlinedTrack, { borderColor: theme.colors.textSecondary, borderRadius: theme.radius.full }]
            : [styles.track, { backgroundColor: theme.colors.border, borderRadius: theme.radius.md }]),
        style,
        slots?.container,
      ]}
      contentContainerStyle={[
        styles.content,
        segmented ? (outlined ? styles.outlinedContent : styles.trackContent) : { gap: theme.spacing.sm },
        slots?.content,
      ]}
      testID={testID}
    >
      {segmented && !outlined && thumb.placed ? (
        <Animated.View
          style={[styles.thumb, thumb.style, { backgroundColor: theme.colors.background, borderRadius: theme.radius.sm }, slots?.thumb]}
        />
      ) : null}
      {items.map((item, index) => (
        <ListItem
          key={item.label}
          item={item}
          selected={index === selectedIndex}
          divided={index > 0}
          variant={variant}
          iconPosition={iconPosition}
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
