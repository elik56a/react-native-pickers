import type { ComponentRef } from 'react';
import type { View } from 'react-native';

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

  it('tells its sheet to open as a dropdown by default, and measures the field on open', async () => {
    const measureInWindow = jest.fn();
    const { result } = await renderHook(() => usePickerField({}));
    expect(result.current.sheet).toEqual({
      presentation: 'dropdown',
      anchor: null,
    });
    result.current.anchorRef.current = { measureInWindow } as unknown as ComponentRef<typeof View>;
    await act(() => result.current.show());
    expect(measureInWindow).toHaveBeenCalled();
  });

  it('does not measure for a bottom sheet or modal', async () => {
    const measureInWindow = jest.fn();
    const { result } = await renderHook(() => usePickerField({ presentation: 'modal' }));
    expect(result.current.sheet.presentation).toBe('modal');
    result.current.anchorRef.current = { measureInWindow } as unknown as ComponentRef<typeof View>;
    await act(() => result.current.show());
    expect(measureInWindow).not.toHaveBeenCalled();
  });

  it('stays closed while disabled', async () => {
    const onOpen = jest.fn();
    const { result } = await renderHook(() => usePickerField({ disabled: true, onOpen }));
    await act(() => result.current.show());
    expect(result.current.open).toBe(false);
    expect(onOpen).not.toHaveBeenCalled();
  });
});
