import { act, renderHook } from '@testing-library/react-native';

import type { DateRange } from '../calendar.types';
import { useCalendarSelection } from './useCalendarSelection';

const day = (d: number) => new Date(2026, 9, d);
const none = () => false;

describe('useCalendarSelection', () => {
  it('builds ranges when uncontrolled and leaves the other modes empty', async () => {
    const onChange = jest.fn();
    const { result } = await renderHook(() => useCalendarSelection({ mode: 'ranges', onChange }, none));
    await act(() => result.current.select(day(3)));
    await act(() => result.current.select(day(5)));
    expect(result.current.selection).toEqual({
      mode: 'ranges',
      single: null,
      range: { start: null, end: null },
      multiple: [],
      ranges: [{ start: day(3), end: day(5) }],
    });
    expect(onChange).toHaveBeenLastCalledWith([{ start: day(3), end: day(5) }]);
  });

  it('follows the value prop when controlled', async () => {
    const onChange = jest.fn();
    const { result, rerender } = await renderHook(
      ({ value }: { value: DateRange[] }) => useCalendarSelection({ mode: 'ranges', value, onChange }, none),
      { initialProps: { value: [{ start: day(3), end: day(5) }] } }
    );
    await act(() => result.current.select(day(4)));
    expect(onChange).toHaveBeenCalledWith([]);
    expect(result.current.selection.ranges).toEqual([{ start: day(3), end: day(5) }]);
    await rerender({ value: [] });
    expect(result.current.selection.ranges).toEqual([]);
  });

  it('skips onChange when a tap is ignored', async () => {
    const onChange = jest.fn();
    const { result } = await renderHook(() =>
      useCalendarSelection({ mode: 'ranges', defaultValue: [{ start: day(3), end: day(5) }], maxRanges: 1, onChange }, none)
    );
    await act(() => result.current.select(day(10)));
    expect(onChange).not.toHaveBeenCalled();
  });
});
