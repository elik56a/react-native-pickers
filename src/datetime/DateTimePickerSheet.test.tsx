import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { toDateKey } from '../core';
import { DateTimePickerSheet } from './DateTimePickerSheet';

const H = 40;

describe('DateTimePickerSheet', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('confirms the scrolled date and time on Done', async () => {
    const onConfirm = jest.fn();
    const onClose = jest.fn();
    await render(
      <DateTimePickerSheet
        visible
        value={new Date(2026, 9, 25, 10, 30)}
        minDate={new Date(2026, 9, 1)}
        format="24h"
        loop={false}
        onClose={onClose}
        onConfirm={onConfirm}
        testID="dt"
      />
    );
    await fireEvent.scroll(screen.getByTestId('dt-day-list'), { nativeEvent: { contentOffset: { y: 2 * H } } });
    await act(() => jest.advanceTimersByTime(500));
    expect(onConfirm).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('button', { name: 'Done' }));
    const confirmed: Date = onConfirm.mock.calls[0][0];
    expect(toDateKey(confirmed)).toBe('2026-10-03');
    expect([confirmed.getHours(), confirmed.getMinutes()]).toEqual([10, 30]);
    expect(onClose).toHaveBeenCalled();
  });
});
