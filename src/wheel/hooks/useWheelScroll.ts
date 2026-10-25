import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Animated, Platform } from 'react-native';
import { SETTLE_DELAY } from '../wheel.constants';
import type { WheelItem } from '../wheel.types';
import { alignToLap, firstEnabled, getLoopLayout, getSettleResult, offsetToIndex, wrapIndex } from '../wheel.utils';

const NATIVE = Platform.OS !== 'web';

interface UseWheelScrollParams<T> {
  items: WheelItem<T>[];
  itemHeight: number;
  loop: boolean;
  value: T | undefined;
  defaultValue: T | undefined;
  isEqual: (a: T, b: T) => boolean;
  onChange?: (value: T, index: number) => void;
  onValueChanging?: (value: T, index: number) => void;
  onDragStart?: () => void;
}

/**
 * Drives a snapping wheel list. The scroll position lives in a ref so scroll events never re-render;
 * only the row under the band (`active`) is state. A loop wheel renders several copies and silently
 * jumps back to the middle copy once it settles near an edge.
 */
export const useWheelScroll = <T>({
  items,
  itemHeight: h,
  loop,
  value,
  defaultValue,
  isEqual,
  onChange,
  onValueChanging,
  onDragStart,
}: UseWheelScrollParams<T>) => {
  const count = items.length;
  const layout = getLoopLayout(count, loop);

  const indexOfValue = useCallback(
    (v: T | undefined) => (v === undefined ? -1 : items.findIndex((it) => isEqual(it.value, v))),
    [items, isEqual]
  );

  const initialLogical = Math.max(0, indexOfValue(value !== undefined ? value : defaultValue));
  const initialDataIndex = (loop ? layout.middle : 0) + firstEnabled(items, initialLogical);

  const listRef = useRef<FlatList<number>>(null);
  const scrollY = useRef(new Animated.Value(initialDataIndex * h)).current;
  const [active, setActive] = useState(initialDataIndex);
  const st = useRef({
    tick: initialDataIndex,
    committed: initialDataIndex % Math.max(count, 1),
    y: initialDataIndex * h,
    dragging: false,
    momentum: false,
    timer: undefined as ReturnType<typeof setTimeout> | undefined,
    mounted: false,
  }).current;

  const callbacks = useRef({ onChange, onValueChanging, onDragStart });
  callbacks.current = { onChange, onValueChanging, onDragStart };

  const scrollToData = useCallback(
    (dataIndex: number, animated: boolean) => {
      listRef.current?.scrollToOffset({ offset: dataIndex * h, animated });
      if (!animated) {
        st.y = dataIndex * h;
        st.tick = dataIndex;
        setActive(dataIndex);
      }
    },
    [h, st]
  );

  const scrollToLogical = useCallback(
    (logicalIndex: number, animated: boolean) => scrollToData(alignToLap(st.tick, logicalIndex, count, loop), animated),
    [count, loop, scrollToData, st]
  );

  const settle = useCallback(() => {
    if (count === 0 || st.dragging || st.momentum) return;
    const result = getSettleResult({ y: st.y, itemHeight: h, items, committed: st.committed, loop, layout });
    if (result.kind === 'snap') {
      scrollToData(result.dataIndex, true);
      return;
    }
    if (result.changed) {
      st.committed = result.logicalIndex;
      const item = items[result.logicalIndex];
      if (item) callbacks.current.onChange?.(item.value, result.logicalIndex);
    }
    if (result.recenterTo !== null) scrollToData(result.recenterTo, false);
  }, [count, h, items, layout, loop, scrollToData, st]);

  const scheduleSettle = useCallback(
    (delay: number) => {
      if (st.timer) clearTimeout(st.timer);
      st.timer = setTimeout(settle, delay);
    },
    [settle, st]
  );

  useEffect(
    () => () => {
      if (st.timer) clearTimeout(st.timer);
    },
    [st]
  );

  const onScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: NATIVE,
        listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
          const y = e.nativeEvent.contentOffset.y;
          st.y = y;
          const dataIndex = offsetToIndex(y, h, layout.total);
          if (dataIndex !== st.tick) {
            st.tick = dataIndex;
            setActive(dataIndex);
            const logicalIndex = wrapIndex(dataIndex, count);
            const item = items[logicalIndex];
            if (item && !item.disabled) callbacks.current.onValueChanging?.(item.value, logicalIndex);
          }
          scheduleSettle(NATIVE ? SETTLE_DELAY.scrollNative : SETTLE_DELAY.scrollWeb);
        },
      }),
    [count, h, items, layout.total, scheduleSettle, scrollY, st]
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: only a new value or new items should move the wheel, not a re-render mid-drag.
  useEffect(() => {
    if (value === undefined || count === 0) return;
    const logicalIndex = indexOfValue(value);
    if (logicalIndex < 0 || logicalIndex === wrapIndex(st.tick, count) || st.dragging || st.momentum) {
      if (logicalIndex >= 0) st.committed = logicalIndex;
      return;
    }
    st.committed = logicalIndex;
    scrollToLogical(logicalIndex, st.mounted);
  }, [value, items]);

  // contentOffset is not honoured on every platform, so position once the list has a size.
  const onLayout = useCallback(() => {
    if (st.mounted) return;
    st.mounted = true;
    requestAnimationFrame(() => listRef.current?.scrollToOffset({ offset: initialDataIndex * h, animated: false }));
  }, [h, initialDataIndex, st]);

  const move = useCallback(
    (delta: number) => {
      const target = st.tick + delta;
      if (!loop && (target < 0 || target >= count)) return;
      scrollToData(target, true);
    },
    [count, loop, scrollToData, st]
  );

  const data = useMemo(() => Array.from({ length: layout.total }, (_, i) => i), [layout.total]);

  const scrollHandlers = useMemo(
    () => ({
      onScroll,
      onScrollBeginDrag: () => {
        st.dragging = true;
        callbacks.current.onDragStart?.();
      },
      onScrollEndDrag: () => {
        st.dragging = false;
        scheduleSettle(SETTLE_DELAY.dragEnd);
      },
      onMomentumScrollBegin: () => {
        st.momentum = true;
      },
      onMomentumScrollEnd: () => {
        st.momentum = false;
        scheduleSettle(SETTLE_DELAY.momentumEnd);
      },
    }),
    [onScroll, scheduleSettle, st]
  );

  return {
    listRef,
    scrollY,
    data,
    active,
    activeItem: items[wrapIndex(active, Math.max(count, 1))],
    initialDataIndex,
    toLogical: (dataIndex: number) => wrapIndex(dataIndex, count),
    scrollToData,
    scrollToLogical,
    move,
    onLayout,
    scrollHandlers,
  };
};
