import { Animated, ScrollView, View } from 'react-native';

import { useComponentTheme } from '../core/theme/ThemeProvider';
import { ARROW_FOCUS } from '../core/utils/keyboard.utils';
import { ListItem } from './components/ListItem';
import { ScrollArrow } from './components/ScrollArrow';
import { useHorizontalList } from './hooks/useHorizontalList';
import { useSegmentThumb } from './hooks/useSegmentThumb';
import { ARROW_POSITION, HORIZONTAL_LIST_VARIANT, ICON_POSITION, LIST_DESIGN, SCROLL_ARROW_SIDES } from './list.constants';
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
  showArrows = false,
  arrowPosition = ARROW_POSITION.outside,
  renderArrow,
  renderItem,
  accessibilityLabel,
  style,
  styles: slots,
  theme: themeProp,
  design,
  testID,
}: HorizontalListProps<T>) => {
  const { theme } = useComponentTheme(themeProp, design);
  const list = useHorizontalList(onChange, theme.spacing.lg);
  const selectedIndex = findItemIndex(items, value, isEqual);
  const thumb = useSegmentThumb(selectedIndex, theme.animation.duration);
  const segmented = variant === HORIZONTAL_LIST_VARIANT.segmented;
  const { outlined } = LIST_DESIGN[theme.design];
  const overlay = arrowPosition === ARROW_POSITION.overlay;
  const scroller = (
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
        !showArrows && style,
        showArrows && !overlay && styles.arrowFrameList,
        slots?.container,
      ]}
      contentContainerStyle={[
        styles.content,
        segmented ? (outlined ? styles.outlinedContent : styles.trackContent) : { gap: theme.spacing.sm },
        slots?.content,
      ]}
      {...ARROW_FOCUS}
      testID={testID}
    >
      {segmented && !outlined && thumb.placed && (
        <Animated.View
          style={[styles.thumb, thumb.style, { backgroundColor: theme.colors.background, borderRadius: theme.radius.sm }, slots?.thumb]}
        />
      )}
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
  if (!showArrows) return scroller;
  // Beside the list, both arrows show while it overflows, so it doesn't change width as it scrolls. Overlaid, only where items hide.
  const overflows = list.hidden.left || list.hidden.right;
  const [left, right] = SCROLL_ARROW_SIDES.map(
    (side) =>
      (overlay ? list.hidden[side] : overflows) && (
        <ScrollArrow
          key={side}
          side={side}
          disabled={!list.hidden[side]}
          overlay={overlay}
          renderArrow={renderArrow}
          onPress={() => list.scrollPage(side, overlay)}
          theme={theme}
          slots={slots}
          testID={testID ? `${testID}-arrow-${side}` : undefined}
        />
      )
  );
  // The arrows need a frame around the scroll view; `style` lays out that frame.
  return overlay ? (
    <View style={style}>
      {scroller}
      {left}
      {right}
    </View>
  ) : (
    <View style={[styles.arrowFrame, { gap: theme.spacing.xs }, style]}>
      {left}
      {scroller}
      {right}
    </View>
  );
};
