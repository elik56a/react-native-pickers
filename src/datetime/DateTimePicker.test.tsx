import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { toDateKey } from '../core';
import { DateTimePicker } from './DateTimePicker';

const H = 40;
const at = (d: number, h = 0, m = 0) => new Date(2026, 9, d, h, m);
const stamp = (d: Date) => `${toDateKey(d)} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
const scrollColumn = async (column: string, index: number) => {
  await fireEvent.scroll(screen.getByTestId(`dt-${column}-list`), { nativeEvent: { contentOffset: { y: index * H } } });
  await act(() => jest.advanceTimersByTime(500));
};

describe('DateTimePicker', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Outside the October 2026 dates below, so no day is labelled 'Today' whenever the suite runs.
    jest.setSystemTime(new Date(2026, 0, 15));
  });
  afterEach(() => jest.useRealTimers());

  describe('wheel display', () => {
    const range = { minDate: at(1), maxDate: at(31, 23, 59) };

    it('shows the day next to the time', async () => {
      await render(<DateTimePicker value={at(27, 9, 5)} {...range} locale="en-US" format="24h" loop={false} testID="dt" />);
      expect(screen.getByTestId('dt-day').props.accessibilityValue.text).toBe('Tue, Oct 27');
      expect(screen.getByTestId('dt-hour').props.accessibilityValue.text).toBe('09');
    });

    it('changes the day and keeps the time', async () => {
      const onChange = jest.fn();
      await render(<DateTimePicker value={at(27, 9, 5)} {...range} format="24h" loop={false} onChange={onChange} testID="dt" />);
      await scrollColumn('day', 4);
      expect(stamp(onChange.mock.calls[0][0])).toBe('2026-10-05 9:05');
    });

    it('changes the time and keeps the day', async () => {
      const onChange = jest.fn();
      await render(<DateTimePicker value={at(27, 9, 5)} {...range} format="24h" loop={false} onChange={onChange} testID="dt" />);
      await scrollColumn('hour', 18);
      expect(stamp(onChange.mock.calls[0][0])).toBe('2026-10-27 18:05');
    });

    it('clamps to minDate when moving onto its day', async () => {
      const onChange = jest.fn();
      await render(
        <DateTimePicker value={at(2, 8)} minDate={at(1, 10)} maxDate={at(31)} format="24h" loop={false} onChange={onChange} testID="dt" />
      );
      await scrollColumn('day', 0);
      expect(stamp(onChange.mock.calls[0][0])).toBe('2026-10-01 10:00');
    });
  });

  describe('calendar display', () => {
    it('picks a day and keeps the time', async () => {
      const onChange = jest.fn();
      await render(<DateTimePicker display="calendar" value={at(27, 14, 30)} format="24h" onChange={onChange} testID="dt" />);
      await fireEvent.press(screen.getByLabelText(/October 12, 2026/));
      expect(stamp(onChange.mock.calls[0][0])).toBe('2026-10-12 14:30');
    });

    it('picks a time and keeps the day', async () => {
      const onChange = jest.fn();
      await render(<DateTimePicker display="calendar" value={at(27, 14, 30)} format="24h" loop={false} onChange={onChange} testID="dt" />);
      await scrollColumn('time-minute', 45);
      expect(stamp(onChange.mock.calls[0][0])).toBe('2026-10-27 14:45');
    });
  });

  it('shows a calendar with time fields to type into in Material, and with clickable time columns on the web', async () => {
    const onChange = jest.fn();
    const { rerender } = await render(
      <DateTimePicker value={at(20, 9, 0)} onChange={onChange} format="24h" design="material" testID="dt" />
    );
    expect(screen.getByTestId('dt-calendar')).toBeTruthy();
    await fireEvent.changeText(screen.getByTestId('dt-time-hour'), '14');
    expect(stamp(onChange.mock.calls[0][0])).toBe('2026-10-20 14:00');

    await rerender(<DateTimePicker value={at(20, 9, 0)} onChange={onChange} format="24h" minuteInterval={15} design="web" testID="dt" />);
    expect(screen.getByTestId('dt-calendar')).toBeTruthy();
    await fireEvent.press(screen.getByLabelText('Minute 45'));
    expect(stamp(onChange.mock.calls[1][0])).toBe('2026-10-20 9:45');
  });

  it('picks the time with the given timeDisplay next to the calendar, whatever the design', async () => {
    await render(<DateTimePicker value={at(20, 9, 0)} format="24h" design="web" timeDisplay="wheel" testID="dt" />);
    expect(screen.getByTestId('dt-calendar')).toBeTruthy();
    expect(screen.getByTestId('dt-time-hour-list')).toBeTruthy();
    expect(screen.queryByLabelText('Hour 09')).toBeNull();
  });
});
