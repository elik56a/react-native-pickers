import { act, renderHook } from '@testing-library/react-native';

import { useNow } from './useNow';

describe('useNow', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 10, 9, 9, 41, 30));
  });
  afterEach(() => jest.useRealTimers());

  it('moves on at the start of each minute', async () => {
    const { result } = await renderHook(() => useNow(true));
    expect(result.current.getMinutes()).toBe(41);
    await act(() => jest.advanceTimersByTime(30_000));
    expect(result.current.getMinutes()).toBe(42);
    await act(() => jest.advanceTimersByTime(60_000));
    expect(result.current.getMinutes()).toBe(43);
  });

  it('stands still while disabled', async () => {
    const { result } = await renderHook(() => useNow(false));
    await act(() => jest.advanceTimersByTime(120_000));
    expect(result.current.getMinutes()).toBe(41);
  });
});
