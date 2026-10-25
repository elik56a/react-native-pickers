import type { GestureResponderEvent, LayoutChangeEvent } from 'react-native';
import { Animated } from 'react-native';

import { act, renderHook } from '@testing-library/react-native';

import type { SheetResizeOptions } from '../sheet.types';
import { useSheetResize } from './useSheetResize';

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
      drag: new Animated.Value(0),
      draggable: true,
      expandable: true,
      swipeToClose: true,
      expandedHeight: 760,
      duration: 0,
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
const dragTo = async (handlers: ReturnType<typeof useSheetResize>['panHandlers'], dy: number) => {
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

const currentValue = (value: Animated.Value) => (value as unknown as { __getValue: () => number }).__getValue();

describe('useSheetResize', () => {
  it('grows with an upward drag and stays expanded past halfway', async () => {
    const { result, onClose } = await setup();
    expect(await dragTo(result.current.panHandlers, -300)).toBe(true);
    expect(result.current.sized).toBe(true);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('follows the finger while dragging up, capped at the expanded height', async () => {
    const { result } = await setup();
    const { panHandlers } = result.current;
    const start = touch(-10, 1000);
    panHandlers.onMoveShouldSetResponderCapture?.(start);
    panHandlers.onMoveShouldSetResponder?.(start);
    await act(() => panHandlers.onResponderGrant?.(start));
    await act(() => panHandlers.onResponderMove?.(touch(-200, 2000, -10)));
    // Measured from where the drag was picked up, so the sheet doesn't jump by the start distance.
    expect(currentValue(result.current.height)).toBe(590);
    await act(() => panHandlers.onResponderMove?.(touch(-900, 3000, -200)));
    expect(currentValue(result.current.height)).toBe(760);
  });

  it('closes when dragged down past the dismiss distance', async () => {
    const { result, onClose } = await setup();
    await dragTo(result.current.panHandlers, 200);
    expect(onClose).toHaveBeenCalled();
  });

  it('claims the touch on press, so the header gets the moves', async () => {
    const { result } = await setup();
    expect(result.current.panHandlers.onStartShouldSetResponder?.(touch(0, 1000))).toBe(true);
  });

  it('ignores drags when not draggable', async () => {
    const { result, onClose } = await setup({ draggable: false });
    expect(result.current.panHandlers.onStartShouldSetResponder?.(touch(0, 1000))).toBe(false);
    expect(await dragTo(result.current.panHandlers, 200)).toBe(false);
    expect(onClose).not.toHaveBeenCalled();
  });
});
