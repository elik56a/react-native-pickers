import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { GestureResponderHandlers, HostInstance, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Animated, PanResponder } from 'react-native';

import { USE_NATIVE_DRIVER } from '../../core/core.constants';
import { useAnimatedValue } from '../../core/hooks/useAnimatedValue';
import { spring } from '../../core/utils/animation.utils';
import { IS_WEB, SHEET_SNAP, SNAP_BACK_BOUNCINESS, SNAP_BACK_SPEED, WHEEL_IDLE_MS, WHEEL_THRESHOLD } from '../sheet.constants';
import type { ScrollNode, SheetResize, SheetResizeOptions, SheetSnap, WheelEventLike, WheelHost } from '../sheet.types';
import {
  canScrollWithin,
  getDragFrame,
  getDragStops,
  getReleaseTarget,
  getSettledSnap,
  getSnapOffsets,
  getWheelTarget,
  isVerticalDrag,
} from '../sheet.utils';

const overflowOf = (node: ScrollNode) =>
  (globalThis as unknown as { getComputedStyle: (node: ScrollNode) => { overflowY: string } }).getComputedStyle(node).overflowY;

/**
 * Drag the header up to expand the sheet and down to collapse or close it; on the web the wheel does the same over the sheet.
 * `offset` is where the sheet sits: on native a scroll view's offset, so the drag runs on the UI thread with JS busy.
 * The sheet only changes height once a drag settles, and its top stays put while it does.
 */
export const useSheetResize = (options: SheetResizeOptions): SheetResize => {
  const { active, slide, draggable, expandable, swipeToClose, expandedHeight } = options;
  const [base, setBase] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const stops = getDragStops(base, expandedHeight, expandable, swipeToClose);
  const offset = useAnimatedValue(stops.base);
  const closing = useRef(false);
  const sheetRef = useRef<HostInstance>(null);
  const latest = useRef({ ...options, base, expanded, stops });
  latest.current = { ...options, base, expanded, stops };

  useEffect(() => {
    if (!active) return;
    closing.current = false;
    setExpanded(false);
    offset.setValue(latest.current.stops.base);
  }, [active, offset]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    latest.current.onClose();
  }, []);

  const snapTo = useCallback(
    (target: SheetSnap) => {
      if (target === SHEET_SNAP.close) {
        close();
        return;
      }
      // Grown first, so expanding reveals content; shrunk after, so collapsing never leaves a gap.
      if (target === SHEET_SNAP.expanded) setExpanded(true);
      spring(offset, latest.current.stops[target], { bounciness: SNAP_BACK_BOUNCINESS, speed: SNAP_BACK_SPEED }).start(({ finished }) => {
        if (finished && target === SHEET_SNAP.base) setExpanded(false);
      });
    },
    [close, offset]
  );

  const panHandlers = useMemo((): GestureResponderHandlers | undefined => {
    if (!IS_WEB) return undefined;
    let start = 0;
    let frame = { height: 0, offset: 0 };
    const maxHeight = () => (latest.current.expandable ? latest.current.expandedHeight : latest.current.base);
    return PanResponder.create({
      // Claimed on touch down: once an ancestor holds the touch, React Native never offers the moves to the header.
      // Buttons in the header sit deeper, so they still win their own taps.
      onStartShouldSetPanResponder: () => latest.current.draggable,
      onMoveShouldSetPanResponder: (_, g) => latest.current.draggable && isVerticalDrag(g.dx, g.dy),
      onPanResponderGrant: () => {
        start = latest.current.expanded ? latest.current.expandedHeight : latest.current.base;
        frame = { height: start, offset: 0 };
      },
      onPanResponderMove: (_, g) => {
        const { base: current, stops: at, swipeToClose: canClose } = latest.current;
        frame = getDragFrame(start, g.dy, current, maxHeight(), canClose);
        offset.setValue(at.base + frame.height - current - frame.offset);
      },
      onPanResponderRelease: (_, g) => snapTo(getReleaseTarget(frame, g.vy, latest.current.base, maxHeight(), latest.current.swipeToClose)),
      onPanResponderTerminate: () => snapTo(latest.current.expanded ? SHEET_SNAP.expanded : SHEET_SNAP.base),
    }).panHandlers;
  }, [offset, snapTo]);

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
      const target = getWheelTarget(total, latest.current.expanded, latest.current.expandable, latest.current.swipeToClose);
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
    if (!latest.current.expanded) setBase(e.nativeEvent.layout.height);
  }, []);

  // Called on both drag end and momentum end: a release right on a stop has no momentum, and anywhere else is still moving.
  const onDragEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const snap = getSettledSnap(e.nativeEvent.contentOffset.y, latest.current.stops);
      if (snap === SHEET_SNAP.close) close();
      else if (snap) setExpanded(snap === SHEET_SNAP.expanded);
    },
    [close]
  );

  const rest = stops.base;
  const animated = useMemo(
    () => ({
      translateY: Animated.add(slide, Animated.subtract(rest, offset)),
      counter: Animated.subtract(offset, rest),
      onScroll: Animated.event([{ nativeEvent: { contentOffset: { y: offset } } }], { useNativeDriver: USE_NATIVE_DRIVER }),
    }),
    [offset, rest, slide]
  );

  const height = expanded ? expandedHeight : base;
  return {
    sheetRef,
    panHandlers,
    onLayout,
    expanded,
    frameStyle: {
      marginBottom: base - height,
      transform: [{ translateY: animated.translateY }],
    },
    dragArea:
      IS_WEB || !draggable || !base
        ? null
        : {
            contentHeight: height + stops.expanded,
            initialOffset: rest,
            snapToOffsets: getSnapOffsets(stops),
            onScroll: animated.onScroll,
            onDragEnd,
            style: { transform: [{ translateY: animated.counter }] },
          },
  };
};
