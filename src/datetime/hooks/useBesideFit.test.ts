import type { LayoutChangeEvent } from 'react-native';

import { act, renderHook } from '@testing-library/react-native';

import { useBesideFit } from './useBesideFit';

const layout = (width: number) => ({ nativeEvent: { layout: { width } } }) as LayoutChangeEvent;

describe('useBesideFit', () => {
  it('moves the time under the calendar when the two do not fit side by side, and back when they do', async () => {
    const { result } = await renderHook(() => useBesideFit(true, 'list'));
    expect(result.current.beside).toBe(true);
    await act(() => {
      result.current.onTimeLayout(layout(176));
      result.current.onLayout(layout(320));
    });
    expect(result.current.beside).toBe(false);
    await act(() => result.current.onTimeLayout(layout(320)));
    await act(() => result.current.onLayout(layout(600)));
    expect(result.current.beside).toBe(true);
  });

  it('tries beside again when the time changes, instead of keeping the width of the time it had', async () => {
    const { result, rerender } = await renderHook(({ timeKey }: { timeKey: string }) => useBesideFit(true, timeKey), {
      initialProps: { timeKey: 'wheel' },
    });
    await act(() => {
      result.current.onTimeLayout(layout(400));
      result.current.onLayout(layout(560));
    });
    expect(result.current.beside).toBe(false);
    await rerender({ timeKey: 'list' });
    expect(result.current.beside).toBe(true);
    await act(() => result.current.onTimeLayout(layout(176)));
    expect(result.current.beside).toBe(true);
  });

  it('keeps the time under the calendar when it was not asked to sit beside it', async () => {
    const { result } = await renderHook(() => useBesideFit(false, 'list'));
    expect(result.current.beside).toBe(false);
  });
});
