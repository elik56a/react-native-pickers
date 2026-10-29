import { fireEvent, render, screen } from '@testing-library/react-native';

import { TimeZonePicker } from './TimeZonePicker';

const ZONES = ['America/New_York', 'Asia/Kolkata', 'Europe/Lisbon'];

describe('TimeZonePicker', () => {
  it('shows the city of a value given by its older name', async () => {
    await render(<TimeZonePicker label="Time zone" timeZones={ZONES} value="Asia/Calcutta" />);
    expect(screen.getByText('Kolkata')).toBeTruthy();
  });

  it('searches by offset and selects a zone by its IANA name', async () => {
    const onChange = jest.fn();
    await render(<TimeZonePicker label="Time zone" timeZones={ZONES} locale="en" preferred={[]} searchable onChange={onChange} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Time zone' }));
    await fireEvent.changeText(screen.getByLabelText('Search time zones'), 'utc+5:30');
    await fireEvent.press(screen.getByLabelText('Kolkata'));
    expect(onChange).toHaveBeenCalledWith('Asia/Kolkata', expect.objectContaining({ label: 'Kolkata' }));
  });
});
