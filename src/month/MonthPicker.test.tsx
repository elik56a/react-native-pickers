import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { MonthPicker } from './MonthPicker';

const oct2026 = new Date(2026, 9, 1);

describe('MonthPicker', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('scrolls month and year wheels on iOS, and reports the first of the month', async () => {
    const onChange = jest.fn();
    await render(<MonthPicker value={oct2026} onChange={onChange} locale="en-US" loop={false} design="ios" testID="month" />);
    expect(screen.queryByTestId('month-day')).toBeNull();
    expect(screen.getByTestId('month-month').props.accessibilityValue.text).toBe('October');
    await fireEvent.scroll(screen.getByTestId('month-month-list'), { nativeEvent: { contentOffset: { y: 2 * 40 } } });
    await act(() => jest.advanceTimersByTime(500));
    expect(onChange).toHaveBeenCalledWith(new Date(2026, 2, 1));
  });

  it('picks from a grid of months in Material, and jumps through the years from the title', async () => {
    const onChange = jest.fn();
    await render(<MonthPicker value={oct2026} onChange={onChange} locale="en-US" design="material" />);
    expect(screen.getByRole('button', { name: 'Oct' }).props.accessibilityState).toMatchObject({ selected: true });
    await fireEvent.press(screen.getByLabelText('Next'));
    expect(screen.getByText('2027')).toBeTruthy();
    await fireEvent.press(screen.getByText('Mar'));
    expect(onChange).toHaveBeenLastCalledWith(new Date(2027, 2, 1));
    await fireEvent.press(screen.getByLabelText('2027'));
    await fireEvent.press(screen.getByText('2020'));
    await fireEvent.press(screen.getByText('Jan'));
    expect(onChange).toHaveBeenLastCalledWith(new Date(2020, 0, 1));
  });

  it('starts uncontrolled on the current month, within min/max', async () => {
    const onChange = jest.fn();
    await render(
      <MonthPicker onChange={onChange} minDate={new Date(2099, 4, 20)} maxDate={new Date(2099, 11, 1)} locale="en-US" design="web" />
    );
    expect(screen.getByText('2099')).toBeTruthy();
    expect(screen.getByLabelText('Previous').props.accessibilityState).toMatchObject({ disabled: true });
  });
});
