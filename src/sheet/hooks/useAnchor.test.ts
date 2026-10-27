import type { ComponentRef } from 'react';
import type { View } from 'react-native';

import { act, renderHook } from '@testing-library/react-native';

import { useAnchor } from './useAnchor';

describe('useAnchor', () => {
  it('has no anchor until measured', async () => {
    const { result } = await renderHook(() => useAnchor());
    expect(result.current.anchor).toBeNull();
    await act(() => result.current.measure());
    expect(result.current.anchor).toBeNull();
  });

  it('stores the measured view in window coordinates', async () => {
    const { result } = await renderHook(() => useAnchor());
    result.current.ref.current = {
      measureInWindow: (callback: (x: number, y: number, width: number, height: number) => void) => callback(16, 100, 300, 48),
    } as unknown as ComponentRef<typeof View>;
    await act(() => result.current.measure());
    expect(result.current.anchor).toEqual({
      x: 16,
      y: 100,
      width: 300,
      height: 48,
    });
  });
});
