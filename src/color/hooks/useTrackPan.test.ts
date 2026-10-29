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

describe('useTrackPan', () => {
  afterEach(() => jest.restoreAllMocks());

  it('reports where the track is touched and follows the drag, inset at the ends, and keeps the gesture', async () => {
    const spy = jest.spyOn(PanResponder, 'create');
    const onMove = jest.fn();
    const { result } = await renderHook(() => useTrackPan(onMove, 10));
    result.current.onLayout({ nativeEvent: { layout: { width: 220, height: 100 } } } as LayoutChangeEvent);
    const responder = spy.mock.calls[0]?.[0] as PanResponderCallbacks;
    const start = touchAt(60, 25);
    responder.onPanResponderGrant?.(start, moved(0, 0));
    expect(onMove).toHaveBeenLastCalledWith(0.25, 0.25);
    responder.onPanResponderMove?.(start, moved(100, 50));
    expect(onMove).toHaveBeenLastCalledWith(0.75, 0.75);
    responder.onPanResponderMove?.(start, moved(1000, -1000));
    expect(onMove).toHaveBeenLastCalledWith(1, 0);
    expect(responder.onPanResponderTerminationRequest?.(start, moved(0, 0))).toBe(false);
  });
});
