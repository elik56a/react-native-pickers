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
});
