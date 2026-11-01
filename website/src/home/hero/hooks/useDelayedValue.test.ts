import { act, renderHook } from '@testing-library/react-native';

import { useDelayedValue } from './useDelayedValue';

describe('useDelayedValue', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('follows the value after the delay', async () => {
    const { result, rerender } = await renderHook(({ value }: { value: string }) => useDelayedValue(value, 500), {
      initialProps: { value: 'time' },
    });
    await rerender({ value: 'date' });
    expect(result.current).toBe('time');
    await act(() => jest.advanceTimersByTime(500));
    expect(result.current).toBe('date');
  });

  it('follows at once without a delay', async () => {
    const { result, rerender } = await renderHook(({ value }: { value: string }) => useDelayedValue(value, 0), {
      initialProps: { value: 'time' },
    });
    await rerender({ value: 'date' });
    expect(result.current).toBe('date');
  });
});
