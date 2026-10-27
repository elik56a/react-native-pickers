import { fireEvent, render, screen } from '@testing-library/react-native';

import { DateTimePickerField } from './DateTimePickerField';

describe('DateTimePickerField', () => {
  it('shows the date and time, and confirms from the sheet', async () => {
    const onConfirm = jest.fn();
    const value = new Date(2026, 9, 26, 18, 45);
    await render(
      <DateTimePickerField label="Pickup" presentation="bottomSheet" format="24h" locale="en-US" value={value} onConfirm={onConfirm} />
    );
    expect(screen.getByText('Oct 26, 2026, 18:45')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Pickup' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Done' }));
    expect(onConfirm).toHaveBeenCalledWith(value);
  });
});
