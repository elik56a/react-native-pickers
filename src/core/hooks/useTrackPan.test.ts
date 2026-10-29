import type { GestureResponderEvent, LayoutChangeEvent, PanResponderCallbacks, PanResponderGestureState } from 'react-native';
import { PanResponder } from 'react-native';

import { renderHook } from '@testing-library/react-native';

import { useTrackPan } from './useTrackPan';

const touchAt = (x: number, y: number) => ({ nativeEvent: { locationX: x, locationY: y } }) as unknown as GestureResponderEvent;
const moved = (dx: number, dy: number) =>
  ({
    dx,
    dy,
  }) as PanResponderGestureState;

const setUp = async (options: Parameters<typeof useTrackPan>[0]) => {
  const spy = jest.spyOn(PanResponder, 'create');
  const { result } = await renderHook(() => useTrackPan(options));
  result.current.onLayout({ nativeEvent: { layout: { width: 220, height: 100 } } } as LayoutChangeEvent);
  return spy.mock.calls[0]?.[0] as PanResponderCallbacks;
};

describe('useTrackPan', () => {
  afterEach(() => jest.restoreAllMocks());

  it('reports where the track is touched and follows the drag, inset at the ends, and keeps the gesture', async () => {
    const onMove = jest.fn();
    const responder = await setUp({ onMove, insetX: 10 });
    const start = touchAt(60, 25);
    responder.onPanResponderGrant?.(start, moved(0, 0));
    expect(onMove).toHaveBeenLastCalledWith(0.25, 0.25);
    responder.onPanResponderMove?.(start, moved(100, 50));
    expect(onMove).toHaveBeenLastCalledWith(0.75, 0.75);
    responder.onPanResponderMove?.(start, moved(1000, -1000));
    expect(onMove).toHaveBeenLastCalledWith(1, 0);
    expect(responder.onPanResponderTerminationRequest?.(start, moved(0, 0))).toBe(false);
  });

  it('reports the first touch to onStart, and the release or a taken gesture to onEnd', async () => {
    const onMove = jest.fn();
    const onStart = jest.fn();
    const onEnd = jest.fn();
    const responder = await setUp({ onMove, onStart, onEnd });
    const start = touchAt(110, 50);
    responder.onPanResponderGrant?.(start, moved(0, 0));
    expect(onStart).toHaveBeenCalledWith(0.5, 0.5);
    expect(onMove).not.toHaveBeenCalled();
    responder.onPanResponderRelease?.(start, moved(0, 0));
    responder.onPanResponderTerminate?.(start, moved(0, 0));
    expect(onEnd).toHaveBeenCalledTimes(2);
  });
});
