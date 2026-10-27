import { type ComponentRef, useRef } from 'react';
import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native';

import type { HorizontalListItem, ItemLayout, ScrollFrame } from '../list.types';
import { getRevealOffset } from '../list.utils';

/** Tracks item positions and the scroll window, so pressing an item at the edge scrolls its hidden neighbor into view. */
export const useHorizontalList = <T>(onChange: ((value: T, item: HorizontalListItem<T>) => void) | undefined, peek: number) => {
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const layouts = useRef<ItemLayout[]>([]);
  const frame = useRef<ScrollFrame>({
    offset: 0,
    width: 0,
    contentWidth: 0,
  });

  const onItemLayout = (index: number, layout: ItemLayout) => {
    layouts.current[index] = layout;
  };

  const onLayout = (e: LayoutChangeEvent) => {
    frame.current.width = e.nativeEvent.layout.width;
  };

  const onContentSizeChange = (contentWidth: number) => {
    frame.current.contentWidth = contentWidth;
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    frame.current.offset = e.nativeEvent.contentOffset.x;
  };

  const press = (item: HorizontalListItem<T>, index: number) => {
    const x = getRevealOffset(layouts.current, index, frame.current, peek);
    if (x !== null) {
      scrollRef.current?.scrollTo({ x, animated: true });
      frame.current.offset = x;
    }
    onChange?.(item.value, item);
  };

  return {
    scrollRef,
    onItemLayout,
    onLayout,
    onContentSizeChange,
    onScroll,
    press,
  };
};
