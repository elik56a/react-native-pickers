import { act, renderHook } from '@testing-library/react-native';

import { useClockDial } from './useClockDial';

const at = (h: number, m = 0) => new Date(2026, 9, 25, h, m);
const hhmm = (d: Date) => `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;

const setup = (date: Date, options = {}, inputOnly = false) => {
  const onChange = jest.fn();
  const hook = renderHook(() => useClockDial(date, onChange, { format: '12h', dayPeriodLabels: ['AM', 'PM'], ...options }, 0, inputOnly));
  return {
    onChange,
    hook,
  };
};

describe('useClockDial', () => {
  it('starts on the hours of a 12h dial, with 12 numbers and the time in large type', async () => {
    const { hook } = setup(at(21, 5));
    const { result } = await hook;
    expect(result.current).toMatchObject({ mode: 'hour', is12: true, isPM: true, hourLabel: '9', minuteLabel: '05', selected: 21 });
    expect(result.current.numbers).toHaveLength(12);
    expect(result.current.handRadius).toBe(104);
  });

  it('puts 24 numbers on a 24h dial', async () => {
    const { hook } = setup(at(9), { format: '24h' });
    const { result } = await hook;
    expect(result.current.numbers).toHaveLength(24);
    expect(result.current.hourLabel).toBe('09');
  });

  it('switches AM/PM, and does nothing when the half is already chosen', async () => {
    const { onChange, hook } = setup(at(9, 30));
    const { result } = await hook;
    await act(() => result.current.selectPeriod(false));
    expect(onChange).not.toHaveBeenCalled();
    await act(() => result.current.selectPeriod(true));
    expect(hhmm(onChange.mock.calls[0][0])).toBe('21:30');
  });

  it('steps the hour, or the minutes by the interval, wrapping around', async () => {
    const { onChange, hook } = setup(at(23, 55), { minuteInterval: 5 });
    const { result } = await hook;
    await act(() => result.current.step(1));
    expect(hhmm(onChange.mock.calls[0][0])).toBe('0:55');
    await act(() => result.current.setMode('minute'));
    await act(() => result.current.step(1));
    expect(hhmm(onChange.mock.calls[1][0])).toBe('23:00');
  });

  it('keeps the time within minTime and maxTime', async () => {
    const { onChange, hook } = setup(at(17), { format: '24h', maxTime: at(17, 30) });
    const { result } = await hook;
    await act(() => result.current.step(1));
    expect(hhmm(onChange.mock.calls[0][0])).toBe('17:30');
  });

  it('sets a typed time once it is valid, and shows the typing until the field is left', async () => {
    const { onChange, hook } = setup(at(9), { format: '24h' });
    const { result } = await hook;
    await act(() => result.current.toggleTyping());
    expect(result.current.typing).toBe(true);
    await act(() => result.current.type('hour', '2'));
    expect(hhmm(onChange.mock.calls[0][0])).toBe('2:00');
    await act(() => result.current.type('hour', '25'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(result.current.fieldText('hour')).toBe('25');
    await act(() => result.current.endTyping());
    expect(result.current.fieldText('hour')).toBe('09');
  });

  it('starts typing in input-only mode', async () => {
    const { hook } = setup(at(9), {}, true);
    const { result } = await hook;
    expect(result.current.typing).toBe(true);
  });

  it('moves to the fields, and back to the dial, when input-only mode changes on a mounted picker', async () => {
    const { result, rerender } = await renderHook(
      ({ inputOnly }: { inputOnly: boolean }) => useClockDial(at(9), jest.fn(), { format: '12h' }, 0, inputOnly),
      { initialProps: { inputOnly: false } }
    );
    expect(result.current.typing).toBe(false);
    await rerender({ inputOnly: true });
    expect(result.current.typing).toBe(true);
    await rerender({ inputOnly: false });
    expect(result.current.typing).toBe(false);
  });
});
