import { act, renderHook } from '@testing-library/react-native';
import { useControllableState } from './useControllableState';

describe('useControllableState', () => {
  it('keeps its own state when uncontrolled', async () => {
    const onChange = jest.fn();
    const { result } = await renderHook(() => useControllableState<number | undefined>(undefined, 1, onChange));
    expect(result.current[0]).toBe(1);
    await act(() => result.current[1](2));
    expect(result.current[0]).toBe(2);
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('follows the value prop when controlled', async () => {
    const onChange = jest.fn();
    const { result, rerender } = await renderHook(({ value }: { value: number }) => useControllableState(value, 0, onChange), {
      initialProps: { value: 5 },
    });
    await act(() => result.current[1](6));
    expect(result.current[0]).toBe(5);
    expect(onChange).toHaveBeenCalledWith(6);
    await rerender({ value: 6 });
    expect(result.current[0]).toBe(6);
  });

  it('treats null as a controlled value', async () => {
    const { result } = await renderHook(() => useControllableState<Date | null>(null, new Date()));
    expect(result.current[0]).toBeNull();
  });

  it('accepts a lazy default', async () => {
    const init = jest.fn(() => 'lazy');
    const { result, rerender } = await renderHook(() => useControllableState<string>(undefined, init));
    await rerender({});
    expect(result.current[0]).toBe('lazy');
    expect(init).toHaveBeenCalledTimes(1);
  });
});
