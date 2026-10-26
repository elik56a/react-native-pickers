import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { TimePickerSheet } from './TimePickerSheet';

const H = 40;

describe('TimePickerSheet', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('confirms the scrolled time on Done', async () => {
    const onConfirm = jest.fn();
    const onClose = jest.fn();
    await render(
      <TimePickerSheet
        visible
        value={new Date(2026, 9, 25, 10, 30)}
        format="24h"
        loop={false}
        onClose={onClose}
        onConfirm={onConfirm}
        testID="time"
      />
    );
    await fireEvent.scroll(screen.getByTestId('time-minute-list'), { nativeEvent: { contentOffset: { y: 45 * H } } });
    await act(() => jest.advanceTimersByTime(500));
    expect(onConfirm).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('button', { name: 'Done' }));
    const confirmed: Date = onConfirm.mock.calls[0][0];
    expect([confirmed.getHours(), confirmed.getMinutes()]).toEqual([10, 45]);
    expect(onClose).toHaveBeenCalled();
  });

  it('confirms the time as shown when the value is between intervals', async () => {
    const onConfirm = jest.fn();
    await render(
      <TimePickerSheet visible value={new Date(2026, 9, 25, 10, 7, 42)} minuteInterval={5} onClose={jest.fn()} onConfirm={onConfirm} />
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Done' }));
    const confirmed: Date = onConfirm.mock.calls[0][0];
    expect([confirmed.getHours(), confirmed.getMinutes(), confirmed.getSeconds()]).toEqual([10, 5, 0]);
  });
});
