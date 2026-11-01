import type { GestureResponderEvent, PanResponderCallbacks, PanResponderGestureState } from 'react-native';
import { PanResponder } from 'react-native';

import { renderHook } from '@testing-library/react-native';

import { useDrag } from './useDrag';

const EVENT = {} as GestureResponderEvent;
const gesture = (g: Partial<PanResponderGestureState>) =>
  ({
    dx: 0,
    dy: 0,
    vx: 0,
    vy: 0,
    ...g,
  }) as PanResponderGestureState;

describe('useDrag', () => {
  afterEach(() => jest.restoreAllMocks());

  it('claims only vertical moves with vertical, and reports the drag to the latest callbacks', async () => {
    const spy = jest.spyOn(PanResponder, 'create');
    const responder = () => spy.mock.calls[0]?.[0] as PanResponderCallbacks;
    const first = jest.fn();
    const onStart = jest.fn();
    const onMove = jest.fn();
    const onEnd = jest.fn();
    const onCancel = jest.fn();
    const { rerender } = await renderHook(
      (props: { onMove: typeof first }) => useDrag({ vertical: true, onStart, onEnd, onCancel, ...props }),
      {
        initialProps: { onMove: first },
      }
    );
    await rerender({ onMove });
    expect(responder().onMoveShouldSetPanResponder?.(EVENT, gesture({ dx: 2, dy: 30 }))).toBe(true);
    expect(responder().onMoveShouldSetPanResponder?.(EVENT, gesture({ dx: 30, dy: 2 }))).toBe(false);
    responder().onPanResponderGrant?.(EVENT, gesture({}));
    responder().onPanResponderMove?.(EVENT, gesture({ dy: 40 }));
    responder().onPanResponderRelease?.(EVENT, gesture({ dy: 80, vy: 1 }));
    responder().onPanResponderTerminate?.(EVENT, gesture({}));
    expect(onStart).toHaveBeenCalled();
    expect(first).not.toHaveBeenCalled();
    expect(onMove).toHaveBeenCalledWith(expect.objectContaining({ dy: 40 }));
    expect(onEnd).toHaveBeenCalledWith(expect.objectContaining({ dy: 80, vy: 1 }));
    expect(onCancel).toHaveBeenCalled();
  });
});
