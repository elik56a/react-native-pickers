import { renderHook } from '@testing-library/react-native';

import { useReturnFocus } from './useReturnFocus';

const mockFocused = { focus: jest.fn() };
jest.mock('../utils/keyboard.utils', () => ({ focusedElement: () => mockFocused }));

describe('useReturnFocus', () => {
  it('focuses what had focus when it opened, once it closes', async () => {
    const { rerender } = await renderHook(({ open }: { open: boolean }) => useReturnFocus(open), { initialProps: { open: true } });
    expect(mockFocused.focus).not.toHaveBeenCalled();
    await rerender({ open: false });
    expect(mockFocused.focus).toHaveBeenCalledTimes(1);
  });
});
