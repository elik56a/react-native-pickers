import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { TimePicker } from './TimePicker';

const H = 40;
const at = (h: number, m = 0) => new Date(2026, 9, 25, h, m);
const hhmm = (d: Date) => `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
const scrollColumn = async (column: string, index: number) => {
  await fireEvent.scroll(screen.getByTestId(`time-${column}-list`), { nativeEvent: { contentOffset: { y: index * H } } });
  await act(() => jest.advanceTimersByTime(500));
};

describe('TimePicker', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('picks from a list of times in the web design, keeping the day', async () => {
    const onChange = jest.fn();
    await render(
      <TimePicker value={at(9, 0)} onChange={onChange} format="24h" locale="en-GB" minuteInterval={30} design="web" testID="time" />
    );
    expect(screen.queryByTestId('time-hour')).toBeNull();
    expect(screen.getByLabelText('9:00').props.accessibilityState).toMatchObject({ selected: true });
    await fireEvent.press(screen.getByLabelText('10:30'));
    expect(hhmm(onChange.mock.calls[0][0])).toBe('10:30');
    expect(onChange.mock.calls[0][0].getDate()).toBe(25);
  });

  it('keeps the wheels in the web design with display="wheel"', async () => {
    await render(<TimePicker value={at(9, 5)} format="24h" loop={false} design="web" display="wheel" testID="time" />);
    expect(screen.getByTestId('time-hour')).toBeTruthy();
  });

  it('shows 24h columns with padded hours', async () => {
    await render(<TimePicker value={at(9, 5)} format="24h" loop={false} testID="time" />);
    expect(screen.getByTestId('time-hour').props.accessibilityValue.text).toBe('09');
    expect(screen.getByTestId('time-minute').props.accessibilityValue.text).toBe('05');
    expect(screen.queryByTestId('time-period')).toBeNull();
  });

  it('shows 12h columns with AM/PM', async () => {
    await render(<TimePicker value={at(14, 30)} format="12h" dayPeriodLabels={['AM', 'PM']} loop={false} testID="time" />);
    expect(screen.getByTestId('time-hour').props.accessibilityValue.text).toBe('2');
    expect(screen.getByTestId('time-period').props.accessibilityValue.text).toBe('PM');
  });

  it('commits a new minute and keeps the date', async () => {
    const onChange = jest.fn();
    await render(<TimePicker value={at(10, 30)} format="24h" loop={false} onChange={onChange} testID="time" />);
    await scrollColumn('minute', 45);
    const next: Date = onChange.mock.calls[0][0];
    expect(hhmm(next)).toBe('10:45');
    expect(next.getDate()).toBe(25);
  });

  it('switches AM/PM without changing the hour on the clock face', async () => {
    const onChange = jest.fn();
    await render(
      <TimePicker value={at(14, 30)} format="12h" dayPeriodLabels={['AM', 'PM']} loop={false} onChange={onChange} testID="time" />
    );
    await scrollColumn('period', 0);
    expect(hhmm(onChange.mock.calls[0][0])).toBe('2:30');
  });

  it('clamps a change that lands before minTime', async () => {
    const onChange = jest.fn();
    await render(
      <TimePicker
        value={at(14)}
        minTime={at(10)}
        format="12h"
        dayPeriodLabels={['AM', 'PM']}
        loop={false}
        onChange={onChange}
        testID="time"
      />
    );
    await scrollColumn('period', 0);
    expect(hhmm(onChange.mock.calls[0][0])).toBe('10:00');
  });
});
