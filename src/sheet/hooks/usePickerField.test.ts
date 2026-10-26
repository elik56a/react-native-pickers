import { act, renderHook } from '@testing-library/react-native';

import { usePickerField } from './usePickerField';

describe('usePickerField', () => {
  it('opens and closes, calling onOpen and onClose', async () => {
    const onOpen = jest.fn();
    const onClose = jest.fn();
    const { result } = await renderHook(() => usePickerField({ onOpen, onClose }));
    await act(() => result.current.show());
    expect(result.current.open).toBe(true);
    expect(onOpen).toHaveBeenCalled();
    await act(() => result.current.hide());
    expect(result.current.open).toBe(false);
    expect(onClose).toHaveBeenCalled();
  });

  it('stays closed while disabled', async () => {
    const onOpen = jest.fn();
    const { result } = await renderHook(() => usePickerField({ disabled: true, onOpen }));
    await act(() => result.current.show());
    expect(result.current.open).toBe(false);
    expect(onOpen).not.toHaveBeenCalled();
  });
});
