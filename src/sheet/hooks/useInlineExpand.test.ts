import type { Animated, LayoutChangeEvent } from 'react-native';

import { act, renderHook } from '@testing-library/react-native';

import { useInlineExpand } from './useInlineExpand';

const layout = (height: number) => ({ nativeEvent: { layout: { x: 0, y: 0, width: 320, height } } }) as LayoutChangeEvent;
const heightOf = (height: Animated.AnimatedInterpolation<number>) => (height as unknown as { __getValue: () => number }).__getValue();

describe('useInlineExpand', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('grows to the measured content height on open and unmounts once folded back up', async () => {
    const { result, rerender } = await renderHook(({ visible }: { visible: boolean }) => useInlineExpand(visible, 200), {
      initialProps: { visible: false },
    });
    expect(result.current.mounted).toBe(false);
    await rerender({ visible: true });
    expect(result.current.mounted).toBe(true);
    await act(() => result.current.onLayout(layout(180)));
    await act(() => jest.advanceTimersByTime(500));
    expect(heightOf(result.current.style.height)).toBe(180);
    await rerender({ visible: false });
    expect(result.current.mounted).toBe(true);
    await act(() => jest.advanceTimersByTime(500));
    expect(heightOf(result.current.style.height)).toBe(0);
    expect(result.current.mounted).toBe(false);
  });

  it('follows the content when it changes height while open', async () => {
    const { result } = await renderHook(() => useInlineExpand(true, 200));
    await act(() => result.current.onLayout(layout(180)));
    await act(() => jest.advanceTimersByTime(500));
    await act(() => result.current.onLayout(layout(240)));
    expect(heightOf(result.current.style.height)).toBe(240);
  });
});
