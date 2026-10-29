import { createElement, type ReactNode } from 'react';

import { act, renderHook } from '@testing-library/react-native';

import { useDraft } from './useDraft';
import { FieldSheetContext } from './useFieldSheet';

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

  it('resets to the value when the reset key changes', async () => {
    const { result, rerender } = await renderHook(
      ({ value, mode }: { value: number; mode: string }) => useDraft(value, true, { resetKey: mode }),
      {
        initialProps: { value: 1, mode: 'single' },
      }
    );
    await act(() => result.current[1](2));
    await rerender({ value: 7, mode: 'single' });
    expect(result.current[0]).toBe(2);
    await rerender({ value: 7, mode: 'multiple' });
    expect(result.current[0]).toBe(7);
  });

  it('commits each change only inside an inline field', async () => {
    const commit = jest.fn();
    const inline = ({ children }: { children: ReactNode }) =>
      createElement(FieldSheetContext.Provider, {
        value: {
          presentation: 'inline',
          anchor: null,
        },
        children,
      });
    const sheet = await renderHook(() => useDraft<number>(1, true, { commit }));
    await act(() => sheet.result.current[1](2));
    expect(commit).not.toHaveBeenCalled();
    const field = await renderHook(() => useDraft<number>(1, true, { commit }), { wrapper: inline });
    await act(() => field.result.current[1](3));
    expect(field.result.current[0]).toBe(3);
    expect(commit).toHaveBeenCalledWith(3);
  });
});
