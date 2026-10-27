import { act, renderHook } from '@testing-library/react-native';

import { useDraft } from './useDraft';

describe('useDraft', () => {
  it('keeps edits while open and resets to the value on reopen', async () => {
    const { result, rerender } = await renderHook(({ value, visible }: { value: number; visible: boolean }) => useDraft(value, visible), {
      initialProps: { value: 1, visible: true },
    });
    await act(() => result.current[1](2));
    expect(result.current[0]).toBe(2);
    await rerender({ value: 5, visible: true });
    expect(result.current[0]).toBe(2);
    await rerender({ value: 5, visible: false });
    expect(result.current[0]).toBe(2);
    await rerender({ value: 5, visible: true });
    expect(result.current[0]).toBe(5);
  });

  it('resets to the value when the reset key changes while open', async () => {
    const { result, rerender } = await renderHook(({ value, mode }: { value: number; mode: string }) => useDraft(value, true, mode), {
      initialProps: { value: 1, mode: 'single' },
    });
    await act(() => result.current[1](2));
    await rerender({ value: 7, mode: 'single' });
    expect(result.current[0]).toBe(2);
    await rerender({ value: 7, mode: 'multiple' });
    expect(result.current[0]).toBe(7);
  });
});
