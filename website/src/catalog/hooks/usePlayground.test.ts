import { act, renderHook } from '@testing-library/react-native';

import type { PlaygroundConfig } from '../catalog.types';
import { usePlayground } from './usePlayground';

const CONFIG: PlaygroundConfig = {
  name: 'DatePicker',
  component: () => null,
  props: { label: 'Dates' },
  value: ({ mode }: { mode: string }) => (mode === 'range' ? { start: null, end: null } : null),
  resetProp: 'onClear',
  controls: [
    { prop: 'mode', options: ['single', 'range'] },
    { prop: 'display', options: ['auto', 'wheel'], unset: 'auto' },
  ],
};

describe('usePlayground', () => {
  it('passes the fixed props, the chosen options and a controlled value', async () => {
    const { result } = await renderHook(() => usePlayground(CONFIG));
    expect(result.current.live).toMatchObject({ label: 'Dates', mode: 'single', value: null });
    expect(result.current.live).not.toHaveProperty('display');
  });

  it('keeps the value the component reports, and resets it', async () => {
    const { result } = await renderHook(() => usePlayground(CONFIG));
    const date = new Date(2026, 9, 29);
    await act(() => (result.current.live.onChange as (d: Date) => void)(date));
    expect(result.current.live.value).toBe(date);
    await act(() => (result.current.live.onClear as () => void)());
    expect(result.current.live.value).toBeNull();
  });

  it('re-runs a value that depends on the options when one changes', async () => {
    const { result } = await renderHook(() => usePlayground(CONFIG));
    await act(() => result.current.choose('mode', 'range'));
    expect(result.current.selection.mode).toBe('range');
    expect(result.current.live.value).toEqual({ start: null, end: null });
  });
});
