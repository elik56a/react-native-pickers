import { renderHook } from '@testing-library/react-native';

import type { TimePanelColumn } from '../time.types';
import { useTimePanelColumn } from './useTimePanelColumn';

const column = (value: number) =>
  ({
    key: 'minute',
    value,
    items: [0, 15, 30, 45].map((m) => ({
      label: String(m),
      value: m,
    })),
    onChange: jest.fn(),
  }) as unknown as TimePanelColumn;

describe('useTimePanelColumn', () => {
  it('opens with the chosen cell in the middle, and lays cells out at a fixed height', async () => {
    const { result } = await renderHook(() => useTimePanelColumn(column(30), 3));
    expect(result.current).toMatchObject({ selected: 30, initialIndex: 1 });
    expect(result.current.getItemLayout(null, 3)).toEqual({ length: 36, offset: 108, index: 3 });
  });

  it('opens at the top when the value is not one of the cells', async () => {
    const { result } = await renderHook(() => useTimePanelColumn(column(7), 5));
    expect(result.current.initialIndex).toBe(0);
  });

  it('animates a newly chosen cell to the middle', async () => {
    const scrollToOffset = jest.fn();
    const { result, rerender } = await renderHook(({ value }: { value: number }) => useTimePanelColumn(column(value), 3), {
      initialProps: { value: 0 },
    });
    Object.assign(result.current.ref, { current: { scrollToOffset } });
    await rerender({ value: 45 });
    expect(scrollToOffset).toHaveBeenCalledWith({ offset: 36, animated: true });
  });
});
