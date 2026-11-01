import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { ExpandableCalendar } from './ExpandableCalendar';

const day = (d: number, m = 9) => new Date(2026, m, d);
const props = { locale: 'en-US', firstDayOfWeek: 0 } as const;

describe('ExpandableCalendar', () => {
  it('starts as the week of the selected day, and picks a day', async () => {
    const onChange = jest.fn();
    await render(<ExpandableCalendar {...props} value={day(14)} onChange={onChange} />);
    expect(screen.getByText('October 2026')).toBeTruthy();
    expect(screen.getByLabelText('Wednesday, October 14, 2026').props.accessibilityState).toMatchObject({ selected: true });
    expect(screen.queryByLabelText('Thursday, October 1, 2026')).toBeNull();
    await fireEvent.press(screen.getByLabelText('Friday, October 16, 2026'));
    expect(onChange).toHaveBeenCalledWith(day(16));
  });

  it('opens into the month with the handle and folds back into the week of the day picked in it', async () => {
    const onExpandedChange = jest.fn();
    await render(<ExpandableCalendar {...props} defaultValue={day(14)} onExpandedChange={onExpandedChange} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Show month' }));
    expect(onExpandedChange).toHaveBeenCalledWith(true);
    expect(screen.getByLabelText('Thursday, October 1, 2026')).toBeTruthy();
    await fireEvent.press(screen.getByLabelText('Wednesday, October 28, 2026'));
    await fireEvent.press(screen.getByRole('button', { name: 'Show week' }));
    await waitFor(() => expect(screen.queryByLabelText('Thursday, October 1, 2026')).toBeNull());
    expect(screen.getByLabelText('Wednesday, October 28, 2026').props.accessibilityState).toMatchObject({ selected: true });
  });

  it('pages by month while open and by week while folded', async () => {
    const onMonthChange = jest.fn();
    const onWeekChange = jest.fn();
    await render(
      <ExpandableCalendar {...props} defaultValue={day(14)} defaultExpanded onMonthChange={onMonthChange} onWeekChange={onWeekChange} />
    );
    await fireEvent.press(screen.getByLabelText('Next'));
    expect(onMonthChange).toHaveBeenCalledWith(day(1, 10));
    expect(screen.getByText('November 2026')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Show week' }));
    await fireEvent.press(screen.getByLabelText('Next'));
    expect(onWeekChange).toHaveBeenCalledWith(day(8, 10));
  });

  it('follows a controlled expanded', async () => {
    const { rerender } = await render(<ExpandableCalendar {...props} value={day(14)} expanded={false} />);
    expect(screen.getByRole('button', { name: 'Show month' }).props.accessibilityState).toMatchObject({ expanded: false });
    await rerender(<ExpandableCalendar {...props} value={day(14)} expanded />);
    expect(screen.getByRole('button', { name: 'Show week' }).props.accessibilityState).toMatchObject({ expanded: true });
    expect(screen.getByLabelText('Thursday, October 1, 2026')).toBeTruthy();
  });
});
