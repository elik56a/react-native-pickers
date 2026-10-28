import { act, renderHook } from '@testing-library/react-native';

import { useFocus } from './useFocus';

describe('useFocus', () => {
  it('is focused between onFocus and onBlur', async () => {
    const { result } = await renderHook(() => useFocus());
    expect(result.current.focused).toBe(false);
    await act(() => result.current.onFocus());
    expect(result.current.focused).toBe(true);
    await act(() => result.current.onBlur());
    expect(result.current.focused).toBe(false);
  });
});
