import { fireEvent, render, screen } from '@testing-library/react-native';

import { WeekStrip } from './WeekStrip';

const day = (d: number) => new Date(2026, 9, d);

describe('WeekStrip', () => {
  it('shows the week of the selected day under its month, and picks a day', async () => {
    const onChange = jest.fn();
    await render(<WeekStrip value={day(28)} onChange={onChange} locale="en-US" firstDayOfWeek={0} />);
    expect(screen.getByText('October 2026')).toBeTruthy();
    expect(screen.getByLabelText('Wednesday, October 28, 2026').props.accessibilityState).toMatchObject({ selected: true });
    expect(screen.getByLabelText('Sunday, October 25, 2026')).toBeTruthy();
    expect(screen.queryByLabelText('Sunday, November 1, 2026')).toBeNull();
    await fireEvent.press(screen.getByLabelText('Friday, October 30, 2026'));
    expect(onChange).toHaveBeenCalledWith(day(30));
  });

  it('pages by week, titled by the month most of the week is in', async () => {
    const onWeekChange = jest.fn();
    await render(<WeekStrip defaultValue={day(28)} onWeekChange={onWeekChange} locale="en-US" firstDayOfWeek={1} />);
    await fireEvent.press(screen.getByLabelText('Next'));
    expect(onWeekChange).toHaveBeenCalledWith(new Date(2026, 10, 2));
    expect(screen.getByText('November 2026')).toBeTruthy();
    expect(screen.getByLabelText('Monday, November 2, 2026')).toBeTruthy();
  });

  it('stops at the week holding minDate, and disables the days before it', async () => {
    await render(<WeekStrip defaultValue={day(28)} minDate={day(27)} locale="en-US" firstDayOfWeek={0} />);
    expect(screen.getByLabelText('Previous').props.accessibilityState).toMatchObject({ disabled: true });
    expect(screen.getByLabelText('Monday, October 26, 2026').props.accessibilityState).toMatchObject({ disabled: true });
  });

  it('follows a value set from outside to another week', async () => {
    const { rerender } = await render(<WeekStrip value={day(28)} locale="en-US" />);
    await rerender(<WeekStrip value={new Date(2026, 11, 24)} locale="en-US" />);
    expect(screen.getByText('December 2026')).toBeTruthy();
  });
});
