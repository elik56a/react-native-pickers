import { fireEvent, render, screen } from '@testing-library/react-native';

import { CountryPicker } from './CountryPicker';

describe('CountryPicker', () => {
  it('shows the selected country with its flag, hidden from screen readers', async () => {
    await render(<CountryPicker label="Country" value="IL" locale="en" />);
    expect(screen.getByText('Israel')).toBeTruthy();
    expect(screen.queryByText('🇮🇱')).toBeNull();
    expect(screen.getByText('🇮🇱', { includeHiddenElements: true })).toBeTruthy();
  });

  it('searches and selects a country by its code', async () => {
    const onChange = jest.fn();
    await render(<CountryPicker label="Country" locale="en" onChange={onChange} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Country' }));
    await fireEvent.changeText(screen.getByLabelText('Search countries'), '+972');
    await fireEvent.press(screen.getByLabelText('Israel'));
    expect(onChange).toHaveBeenCalledWith('IL', expect.objectContaining({ value: 'IL', label: 'Israel' }));
  });

  it('lists preferred countries first under their header', async () => {
    await render(<CountryPicker label="Country" locale="en" preferred={['US']} preferredLabel="Popular" />);
    await fireEvent.press(screen.getByRole('button', { name: 'Country' }));
    expect(screen.getByText('Popular')).toBeTruthy();
    expect(screen.getByText('All countries')).toBeTruthy();
  });
});
