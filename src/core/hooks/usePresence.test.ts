import { act, renderHook, waitFor } from '@testing-library/react-native';

import { usePresence } from './usePresence';

const DURATION = 20;

describe('usePresence', () => {
  it('stays unmounted until first shown', async () => {
    const { result } = await renderHook(() => usePresence({ visible: false, duration: DURATION }));
    expect(result.current.mounted).toBe(false);
  });

  it('mounts on show, and unmounts only after the exit animation', async () => {
    const onShown = jest.fn();
    const onHidden = jest.fn();
    const { result, rerender } = await renderHook(
      ({ visible }: { visible: boolean }) => usePresence({ visible, duration: DURATION, onShown, onHidden }),
      { initialProps: { visible: false } }
    );

    await rerender({ visible: true });
    expect(result.current.mounted).toBe(true);
    await waitFor(() => expect(onShown).toHaveBeenCalled());

    await act(() => rerender({ visible: false }));
    expect(result.current.mounted).toBe(true);
    await waitFor(() => expect(result.current.mounted).toBe(false));
    expect(onHidden).toHaveBeenCalledTimes(1);
  });
});
