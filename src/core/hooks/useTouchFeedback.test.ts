import type { GestureResponderEvent, HostInstance } from 'react-native';

import { act, renderHook } from '@testing-library/react-native';

import { lightTheme } from '../theme/theme.constants';
import { useTouchFeedback } from './useTouchFeedback';

const press = (pageX: number, pageY: number) => ({ nativeEvent: { pageX, pageY } }) as GestureResponderEvent;

/** An element 100×40 placed at (10, 20) on the page. */
const placeElement = (ref: { current: HostInstance | null }) => {
  ref.current = {
    measure: (callback: (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => void) =>
      callback(0, 0, 100, 40, 10, 20),
  } as unknown as HostInstance;
};

describe('useTouchFeedback', () => {
  it('tints on hover, and not when disabled', async () => {
    const { result, rerender } = await renderHook(({ disabled }: { disabled: boolean }) => useTouchFeedback(lightTheme, disabled), {
      initialProps: { disabled: false },
    });
    await act(() => result.current.handlers.onHoverIn());
    expect(result.current.feedback.hovered).toBe(true);
    await rerender({ disabled: true });
    expect(result.current.feedback.hovered).toBe(false);
    await rerender({ disabled: false });
    await act(() => result.current.handlers.onHoverOut());
    expect(result.current.feedback.hovered).toBe(false);
  });

  it('starts the ripple where the element was touched, sized to reach its far corner', async () => {
    const { result } = await renderHook(() => useTouchFeedback(lightTheme));
    placeElement(result.current.ref);
    await act(() => result.current.handlers.onPressIn(press(60, 30)));
    expect(result.current.feedback.ripple).toEqual({ x: 50, y: 10, radius: Math.hypot(50, 30) });
  });

  it('has no ripple when the ripple is switched off, but still hovers', async () => {
    const { result } = await renderHook(() => useTouchFeedback(lightTheme, false, false));
    placeElement(result.current.ref);
    await act(() => result.current.handlers.onPressIn(press(60, 30)));
    expect(result.current.feedback.ripple).toBeNull();
    await act(() => result.current.handlers.onHoverIn());
    expect(result.current.feedback.hovered).toBe(true);
  });

  it('has no ripple when disabled', async () => {
    const { result } = await renderHook(() => useTouchFeedback(lightTheme, true));
    placeElement(result.current.ref);
    await act(() => result.current.handlers.onPressIn(press(60, 30)));
    expect(result.current.feedback.ripple).toBeNull();
  });
});
