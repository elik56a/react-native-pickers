import type { GestureResponderEvent, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Animated } from 'react-native';

import { act, renderHook } from '@testing-library/react-native';

import { DRAG_REACH } from '../sheet.constants';
import type { SheetResizeOptions } from '../sheet.types';
import { useSheetResize } from './useSheetResize';

let mockWeb = false;
jest.mock('../sheet.constants', () => ({
  ...jest.requireActual('../sheet.constants'),
  get IS_WEB() {
    return mockWeb;
  },
}));

/** A single finger that started at y=500 and has now moved `dy`, the shape PanResponder reads from the responder system. */
const touch = (dy: number, time: number, previousDy = 0) =>
  ({
    nativeEvent: {},
    touchHistory: {
      numberActiveTouches: 1,
      indexOfSingleActiveTouch: 0,
      mostRecentTimeStamp: time,
      touchBank: [
        {
          touchActive: true,
          startPageX: 0,
          startPageY: 500,
          startTimeStamp: 0,
          currentPageX: 0,
          currentPageY: 500 + dy,
          currentTimeStamp: time,
          previousPageX: 0,
          previousPageY: 500 + previousDy,
          previousTimeStamp: time - 16,
        },
      ],
    },
  }) as unknown as GestureResponderEvent;

const setup = async (overrides: Partial<SheetResizeOptions> = {}) => {
  const onClose = jest.fn();
  const hook = await renderHook(() =>
    useSheetResize({
      active: true,
      slide: new Animated.Value(0).interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
      draggable: true,
      expandable: true,
      swipeToClose: true,
      expandedHeight: 760,
      onClose,
      ...overrides,
    })
  );
  await act(() => hook.result.current.onLayout({ nativeEvent: { layout: { height: 400 } } } as LayoutChangeEvent));
  return {
    ...hook,
    onClose,
  };
};

/** Moves the finger slowly in small steps, so the release has no flick velocity. */
const dragTo = async (handlers: ReturnType<typeof useSheetResize>['panHandlers'] = {}, dy: number) => {
  const steps = 20;
  let time = 1000;
  let previous = 0;
  const first = touch(dy / steps, time);
  // The capture pass is where PanResponder measures the move; the bubble pass then asks whether to claim it.
  handlers.onMoveShouldSetResponderCapture?.(first);
  const claimed = handlers.onMoveShouldSetResponder?.(first) ?? false;
  if (!claimed) return false;
  await act(() => handlers.onResponderGrant?.(first));
  for (let i = 1; i <= steps; i++) {
    time += 1000;
    const next = (dy * i) / steps;
    await act(() => handlers.onResponderMove?.(touch(next, time, previous)));
    previous = next;
  }
  time += 1000;
  await act(() => handlers.onResponderRelease?.(touch(dy, time, dy)));
  return true;
};

const translateOf = (result: { current: ReturnType<typeof useSheetResize> }) => {
  const [{ translateY }] = result.current.frameStyle.transform as [{ translateY: unknown }];
  return (translateY as { __getValue: () => number }).__getValue();
};

const settle = (y: number) => ({ nativeEvent: { contentOffset: { x: 0, y } } }) as NativeSyntheticEvent<NativeScrollEvent>;

describe('useSheetResize on native', () => {
  beforeEach(() => {
    mockWeb = false;
  });

  it('drags with a scroll view resting where pulling down has room to close the sheet', async () => {
    const { result } = await setup();
    expect(result.current.panHandlers).toBeUndefined();
    expect(result.current.dragArea).toMatchObject({
      initialOffset: DRAG_REACH,
      snapToOffsets: [DRAG_REACH - 400, DRAG_REACH, DRAG_REACH + 360],
      contentHeight: 400 + DRAG_REACH + 360,
    });
  });

  it('closes once settled on the close stop, and only once', async () => {
    const { result, onClose } = await setup();
    await act(() => result.current.dragArea?.onDragEnd(settle(DRAG_REACH - 400)));
    await act(() => result.current.dragArea?.onDragEnd(settle(DRAG_REACH - 400)));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('expands on the top stop, hanging the taller sheet below the window so its top stays put', async () => {
    const { result, onClose } = await setup();
    await act(() => result.current.dragArea?.onDragEnd(settle(DRAG_REACH + 360)));
    expect(result.current.expanded).toBe(true);
    expect(result.current.frameStyle.marginBottom).toBe(-360);
    expect(result.current.dragArea?.contentHeight).toBe(760 + DRAG_REACH + 360);
    await act(() => result.current.dragArea?.onDragEnd(settle(DRAG_REACH)));
    expect(result.current.expanded).toBe(false);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('ignores a release between stops: the snap is still on its way', async () => {
    const { result, onClose } = await setup();
    await act(() => result.current.dragArea?.onDragEnd(settle(DRAG_REACH - 100)));
    expect(onClose).not.toHaveBeenCalled();
    expect(result.current.expanded).toBe(false);
  });

  it("can't be pulled down without swipe to close", async () => {
    const { result } = await setup({ swipeToClose: false, expandable: false });
    expect(result.current.dragArea?.snapToOffsets).toEqual([0]);
  });

  it('has no drag area when not draggable', async () => {
    const { result } = await setup({ draggable: false });
    expect(result.current.dragArea).toBeNull();
  });
});

describe('useSheetResize on the web', () => {
  beforeEach(() => {
    mockWeb = true;
  });

  it('grows with an upward drag and stays expanded past halfway', async () => {
    const { result, onClose } = await setup();
    expect(result.current.dragArea).toBeNull();
    expect(await dragTo(result.current.panHandlers, -300)).toBe(true);
    expect(result.current.expanded).toBe(true);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('follows the finger while dragging up, capped at the expanded height', async () => {
    const { result } = await setup();
    const panHandlers = result.current.panHandlers ?? {};
    const start = touch(-10, 1000);
    panHandlers.onMoveShouldSetResponderCapture?.(start);
    panHandlers.onMoveShouldSetResponder?.(start);
    await act(() => panHandlers.onResponderGrant?.(start));
    await act(() => panHandlers.onResponderMove?.(touch(-200, 2000, -10)));
    // Measured from where the drag was picked up, so the sheet doesn't jump by the start distance.
    expect(translateOf(result)).toBe(-190);
    await act(() => panHandlers.onResponderMove?.(touch(-900, 3000, -200)));
    expect(translateOf(result)).toBe(-360);
  });

  it('closes when dragged down past the dismiss distance', async () => {
    const { result, onClose } = await setup();
    await dragTo(result.current.panHandlers, 200);
    expect(onClose).toHaveBeenCalled();
  });

  it('claims the touch on press, so the header gets the moves', async () => {
    const { result } = await setup();
    expect(result.current.panHandlers?.onStartShouldSetResponder?.(touch(0, 1000))).toBe(true);
  });

  it('ignores drags when not draggable', async () => {
    const { result, onClose } = await setup({ draggable: false });
    expect(result.current.panHandlers?.onStartShouldSetResponder?.(touch(0, 1000))).toBe(false);
    expect(await dragTo(result.current.panHandlers, 200)).toBe(false);
    expect(onClose).not.toHaveBeenCalled();
  });
});
