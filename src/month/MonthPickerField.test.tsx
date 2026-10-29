import { fireEvent, render, screen } from '@testing-library/react-native';

import { MonthPickerField } from './MonthPickerField';

describe('MonthPickerField', () => {
  it('shows the month and confirms it from the sheet', async () => {
    const onConfirm = jest.fn();
    await render(<MonthPickerField label="Report" locale="en-US" value={new Date(2026, 9, 1)} onConfirm={onConfirm} design="web" />);
    expect(screen.getByText('October 2026')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Report' }));
    await fireEvent.press(screen.getByText('Dec'));
    await fireEvent.press(screen.getByRole('button', { name: 'Done' }));
    expect(onConfirm).toHaveBeenCalledWith(new Date(2026, 11, 1));
  });

  it('expands inline, commits each change without a Done button, and collapses on a second tap', async () => {
    const onConfirm = jest.fn();
    const onClose = jest.fn();
    await render(
      <MonthPickerField
        label="Report"
        locale="en-US"
        value={new Date(2026, 9, 1)}
        presentation="inline"
        onConfirm={onConfirm}
        onClose={onClose}
        design="web"
      />
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Report' }));
    expect(screen.queryByRole('button', { name: 'Done' })).toBeNull();
    await fireEvent.press(screen.getByText('Dec'));
    expect(onConfirm).toHaveBeenCalledWith(new Date(2026, 11, 1));
    await fireEvent.press(screen.getByRole('button', { name: 'Report' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
