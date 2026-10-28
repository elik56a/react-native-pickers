import type { GestureResponderEvent, PanResponderCallbacks, PanResponderGestureState } from 'react-native';
import { I18nManager, PanResponder } from 'react-native';

import { renderHook } from '@testing-library/react-native';

import { useSwipe } from './useSwipe';

const EVENT = {} as GestureResponderEvent;
const gesture = (g: Partial<PanResponderGestureState>) =>
  ({
    dx: 0,
    dy: 0,
    vx: 0,
    vy: 0,
    ...g,
  }) as PanResponderGestureState;

/** The callbacks the hook gives its PanResponder. */
const captureResponder = () => {
  const spy = jest.spyOn(PanResponder, 'create');
  return () => spy.mock.calls[0]?.[0] as PanResponderCallbacks;
};

describe('useSwipe', () => {
  afterEach(() => jest.restoreAllMocks());

  it('claims horizontal moves and pages forward on a swipe left, back on a swipe right', async () => {
    const responder = captureResponder();
    const go = jest.fn();
    await renderHook(() => useSwipe(go));
    expect(responder().onMoveShouldSetPanResponder?.(EVENT, gesture({ dx: 30, dy: 2 }))).toBe(true);
    expect(responder().onMoveShouldSetPanResponder?.(EVENT, gesture({ dx: 5, dy: 30 }))).toBe(false);
    responder().onPanResponderRelease?.(EVENT, gesture({ dx: -80 }));
    expect(go).toHaveBeenLastCalledWith(1);
    responder().onPanResponderRelease?.(EVENT, gesture({ dx: 80 }));
    expect(go).toHaveBeenLastCalledWith(-1);
    responder().onPanResponderRelease?.(EVENT, gesture({ dx: 10 }));
    expect(go).toHaveBeenCalledTimes(2);
  });

  it('calls the latest `go`, and mirrors in RTL', async () => {
    const responder = captureResponder();
    const first = jest.fn();
    const latest = jest.fn();
    const { rerender } = await renderHook(({ go }: { go: (delta: number) => void }) => useSwipe(go), { initialProps: { go: first } });
    await rerender({ go: latest });
    jest.replaceProperty(I18nManager, 'isRTL', true);
    responder().onPanResponderRelease?.(EVENT, gesture({ dx: -80 }));
    expect(first).not.toHaveBeenCalled();
    expect(latest).toHaveBeenCalledWith(-1);
  });
});
