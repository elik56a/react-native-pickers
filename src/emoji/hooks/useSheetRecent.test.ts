import { act, renderHook } from '@testing-library/react-native';

import { useSheetRecent } from './useSheetRecent';

type Props = Parameters<typeof useSheetRecent>[0];

const open: Props = { visible: true, closeOnSelect: true };

describe('useSheetRecent', () => {
  it('records a pick but keeps showing the recents it opened with until it opens again', async () => {
    const onRecentChange = jest.fn();
    const { result, rerender } = await renderHook((props: Props) => useSheetRecent(props), {
      initialProps: { ...open, defaultRecent: ['🍕'], onRecentChange },
    });

    await act(() => result.current.onRecentChange(['😀', '🍕']));
    expect(onRecentChange).toHaveBeenCalledWith(['😀', '🍕']);
    expect(result.current.recent).toEqual(['🍕']);

    await rerender({ ...open, visible: false, defaultRecent: ['🍕'], onRecentChange });
    expect(result.current.recent).toEqual(['🍕']);

    await rerender({ ...open, defaultRecent: ['🍕'], onRecentChange });
    expect(result.current.recent).toEqual(['😀', '🍕']);
  });

  it('shows each pick at once when the sheet stays open', async () => {
    const { result } = await renderHook(() => useSheetRecent({ ...open, closeOnSelect: false }));
    await act(() => result.current.onRecentChange(['😀']));
    expect(result.current.recent).toEqual(['😀']);
  });
});
