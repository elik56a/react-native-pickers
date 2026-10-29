import { act, renderHook } from '@testing-library/react-native';

import { useCollapsible } from './useCollapsible';

describe('useCollapsible', () => {
  it('starts with the given sections open and folds or opens one on toggle', async () => {
    const { result } = await renderHook(() => useCollapsible(() => ['Components']));
    expect(result.current.isOpen('Components')).toBe(true);
    expect(result.current.isOpen('Select')).toBe(false);

    await act(() => result.current.toggle('Components'));
    await act(() => result.current.toggle('Select'));
    expect(result.current.isOpen('Components')).toBe(false);
    expect(result.current.isOpen('Select')).toBe(true);
  });
});
