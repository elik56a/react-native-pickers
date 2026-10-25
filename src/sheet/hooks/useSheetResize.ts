import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { GestureResponderHandlers, HostInstance, LayoutChangeEvent } from 'react-native';
import { Animated, Easing, PanResponder } from 'react-native';

import {
  IS_WEB,
  RESIZE_DURATION_RATIO,
  SNAP_BACK_BOUNCINESS,
  SNAP_BACK_SPEED,
  USE_NATIVE_DRIVER,
  WHEEL_IDLE_MS,
  WHEEL_THRESHOLD,
} from '../sheet.constants';
import type { ScrollNode, SheetResize, SheetResizeOptions, SheetSnap, WheelEventLike, WheelHost } from '../sheet.types';
import { canScrollWithin, getDragFrame, getReleaseTarget, getWheelTarget, isVerticalDrag } from '../sheet.utils';

const overflowOf = (node: ScrollNode) =>
  (globalThis as unknown as { getComputedStyle: (node: ScrollNode) => { overflowY: string } }).getComputedStyle(node).overflowY;

/**
 * Drag the header up to expand the sheet and down to collapse or close it; on the web the wheel does the same over the sheet.
 * `height` drives the sheet only while `sized` (dragging or expanded), so at rest it keeps sizing to its content.
 */
export const useSheetResize = (options: SheetResizeOptions): SheetResize => {
  const { active, drag } = options;
  const height = useRef(new Animated.Value(0)).current;
  const [sized, setSized] = useState(false);
  const sizedRef = useRef(false);
  const base = useRef(0);
  const expanded = useRef(false);
  const sheetRef = useRef<HostInstance>(null);
  const latest = useRef(options);
  latest.current = options;

  const setSizedBoth = useCallback((next: boolean) => {
    sizedRef.current = next;
    setSized(next);
  }, []);

  useEffect(() => {
    if (!active) return;
    expanded.current = false;
    setSizedBoth(false);
  }, [active, setSizedBoth]);

  const snapTo = useCallback(
    (target: SheetSnap) => {
      const { expandedHeight, duration, onClose } = latest.current;
      if (target === 'close') {
        onClose();
        return;
      }
      const toExpanded = target === 'expanded';
      if (!sizedRef.current) height.setValue(base.current);
      expanded.current = toExpanded;
      setSizedBoth(true);
      Animated.spring(drag, {
        toValue: 0,
        useNativeDriver: USE_NATIVE_DRIVER,
        bounciness: SNAP_BACK_BOUNCINESS,
        speed: SNAP_BACK_SPEED,
      }).start();
      Animated.timing(height, {
        toValue: toExpanded ? expandedHeight : base.current,
        duration: duration * RESIZE_DURATION_RATIO,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished && !expanded.current) setSizedBoth(false);
      });
    },
    [drag, height, setSizedBoth]
  );

  const panHandlers = useMemo((): GestureResponderHandlers => {
    let start = 0;
    let frame = { height: 0, offset: 0 };
    const maxHeight = () => (latest.current.expandable ? latest.current.expandedHeight : base.current);
    return PanResponder.create({
      // Claimed on touch down: once an ancestor holds the touch, React Native never offers the moves to the header.
      // Buttons in the header sit deeper, so they still win their own taps.
      onStartShouldSetPanResponder: () => latest.current.draggable,
      onMoveShouldSetPanResponder: (_, g) => latest.current.draggable && isVerticalDrag(g.dx, g.dy),
      onPanResponderGrant: () => {
        start = expanded.current ? latest.current.expandedHeight : base.current;
        frame = { height: start, offset: 0 };
        height.setValue(start);
        setSizedBoth(true);
      },
      onPanResponderMove: (_, g) => {
        frame = getDragFrame(start, g.dy, base.current, maxHeight(), latest.current.swipeToClose);
        height.setValue(frame.height);
        drag.setValue(frame.offset);
      },
      onPanResponderRelease: (_, g) => snapTo(getReleaseTarget(frame, g.vy, base.current, maxHeight(), latest.current.swipeToClose)),
      onPanResponderTerminate: () => snapTo(expanded.current ? 'expanded' : 'base'),
    }).panHandlers;
  }, [drag, height, setSizedBoth, snapTo]);

  useEffect(() => {
    const node = sheetRef.current as unknown as WheelHost | null;
    if (!IS_WEB || !active || !node) return;
    let total = 0;
    let locked = false;
    let idle: ReturnType<typeof setTimeout> | undefined;
    const onWheel = (e: WheelEventLike) => {
      clearTimeout(idle);
      idle = setTimeout(() => {
        locked = false;
        total = 0;
      }, WHEEL_IDLE_MS);
      if (canScrollWithin(e.target, node, e.deltaY, overflowOf)) return;
      // The sheet owns this wheel: don't let the page behind it scroll too.
      e.preventDefault();
      if (locked) return;
      total = Math.sign(total) === Math.sign(e.deltaY) ? total + e.deltaY : e.deltaY;
      if (Math.abs(total) < WHEEL_THRESHOLD) return;
      const { expandable, swipeToClose } = latest.current;
      const target = getWheelTarget(total, expanded.current, expandable, swipeToClose);
      // Locked until the wheel goes quiet, so one flick (and its trackpad momentum) moves the sheet one step.
      locked = true;
      if (target) snapTo(target);
    };
    node.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      clearTimeout(idle);
      node.removeEventListener('wheel', onWheel);
    };
  }, [active, snapTo]);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    if (!sizedRef.current) base.current = e.nativeEvent.layout.height;
  }, []);

  return {
    sheetRef,
    panHandlers,
    onLayout,
    height,
    sized,
  };
};
