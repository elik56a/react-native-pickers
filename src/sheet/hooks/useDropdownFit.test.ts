import type { LayoutChangeEvent } from 'react-native';
import { StyleSheet } from 'react-native';

import { act, renderHook } from '@testing-library/react-native';

import { useDropdownFit } from './useDropdownFit';

const layout = (height: number) => ({ nativeEvent: { layout: { height } } }) as LayoutChangeEvent;

describe('useDropdownFit', () => {
  it('assumes a calendar-sized dropdown until the content is measured', async () => {
    const { result } = await renderHook(() => useDropdownFit());
    expect(result.current).toMatchObject({ height: 440, measured: false });
  });

  it('sizes the dropdown to its content, buttons and borders, past the assumed height when they need it', async () => {
    const { result } = await renderHook(() => useDropdownFit());
    await act(() => {
      result.current.onContentSizeChange(320, 500);
      result.current.onFooterLayout(layout(40));
    });
    expect(result.current).toMatchObject({ height: Math.ceil(552 + StyleSheet.hairlineWidth * 2), measured: true });
  });
});
