import { createElement, type ReactNode } from 'react';
import type { HostInstance } from 'react-native';

import { act, renderHook } from '@testing-library/react-native';

import { PickersProvider } from '../../core';
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

  it('measures the field on open for a dropdown', async () => {
    const measureInWindow = jest.fn();
    const { result } = await renderHook(() => usePickerField({ presentation: 'dropdown' }));
    expect(result.current.sheet).toEqual({
      presentation: 'dropdown',
      anchor: null,
    });
    result.current.anchor.ref.current = { measureInWindow } as unknown as HostInstance;
    await act(() => result.current.show());
    expect(measureInWindow).toHaveBeenCalled();
  });

  it('opens a sheet by default on native, without measuring', async () => {
    const measureInWindow = jest.fn();
    const { result } = await renderHook(() => usePickerField({}));
    expect(result.current.sheet.presentation).toBe('auto');
    result.current.anchor.ref.current = { measureInWindow } as unknown as HostInstance;
    await act(() => result.current.show());
    expect(measureInWindow).not.toHaveBeenCalled();
  });

  it('opens a dropdown by default when the provider says the platform is the web', async () => {
    const wrapper = ({ children }: { children: ReactNode }) =>
      createElement(PickersProvider, {
        platform: 'web',
        children,
      });
    const { result } = await renderHook(() => usePickerField({}), { wrapper });
    expect(result.current.sheet.presentation).toBe('dropdown');
  });

  it('toggles an inline picker, and only opens the others', async () => {
    const inline = await renderHook(() => usePickerField({ presentation: 'inline' }));
    await act(() => inline.result.current.toggle());
    expect(inline.result.current.open).toBe(true);
    await act(() => inline.result.current.toggle());
    expect(inline.result.current.open).toBe(false);
    const sheet = await renderHook(() => usePickerField({ presentation: 'bottomSheet' }));
    await act(() => sheet.result.current.toggle());
    await act(() => sheet.result.current.toggle());
    expect(sheet.result.current.open).toBe(true);
  });

  it('stays closed while disabled', async () => {
    const onOpen = jest.fn();
    const { result } = await renderHook(() => usePickerField({ disabled: true, onOpen }));
    await act(() => result.current.show());
    expect(result.current.open).toBe(false);
    expect(onOpen).not.toHaveBeenCalled();
  });
});
