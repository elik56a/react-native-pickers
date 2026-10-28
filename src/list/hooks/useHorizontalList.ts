import { type ComponentRef, useRef, useState } from 'react';
import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native';

import { SCROLL_ARROW_SIZE } from '../list.constants';
import type { HorizontalListArrowSide, HorizontalListItem, ItemLayout, ScrollFrame } from '../list.types';
import { getHiddenSides, getPageOffset, getRevealOffset } from '../list.utils';

/** Tracks item positions and the scroll window, so pressing an item at the edge scrolls its hidden neighbor into view, and arrows page. */
export const useHorizontalList = <T>(onChange: ((value: T, item: HorizontalListItem<T>) => void) | undefined, peek: number) => {
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const layouts = useRef<ItemLayout[]>([]);
  const frame = useRef<ScrollFrame>({
    offset: 0,
    width: 0,
    contentWidth: 0,
  });
  const [hidden, setHidden] = useState(() => getHiddenSides(frame.current));

  const syncHidden = () => {
    const next = getHiddenSides(frame.current);
    setHidden((prev) => (prev.left === next.left && prev.right === next.right ? prev : next));
  };

  const scrollTo = (x: number) => {
    scrollRef.current?.scrollTo({ x, animated: true });
    frame.current.offset = x;
    syncHidden();
  };

  const onItemLayout = (index: number, layout: ItemLayout) => {
    layouts.current[index] = layout;
  };

  const onLayout = (e: LayoutChangeEvent) => {
    frame.current.width = e.nativeEvent.layout.width;
    syncHidden();
  };

  const onContentSizeChange = (contentWidth: number) => {
    frame.current.contentWidth = contentWidth;
    syncHidden();
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    frame.current.offset = e.nativeEvent.contentOffset.x;
    syncHidden();
  };

  const press = (item: HorizontalListItem<T>, index: number) => {
    const x = getRevealOffset(layouts.current, index, frame.current, peek);
    if (x !== null) scrollTo(x);
    onChange?.(item.value, item);
  };

  // Overlaid arrows cover both edges, so a page is the visible width less two arrows; beside the list, less a peek of context.
  const scrollPage = (side: HorizontalListArrowSide, overlay: boolean) =>
    scrollTo(getPageOffset(frame.current, side, overlay ? SCROLL_ARROW_SIZE * 2 : peek));

  return {
    scrollRef,
    onItemLayout,
    onLayout,
    onContentSizeChange,
    onScroll,
    press,
    hidden,
    scrollPage,
  };
};
