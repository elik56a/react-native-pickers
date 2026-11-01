import { fireEvent, render, screen } from '@testing-library/react-native';

import { CurrencyPicker } from './CurrencyPicker';

describe('CurrencyPicker', () => {
  it('shows the selected currency by name, with its flag hidden from screen readers', async () => {
    await render(<CurrencyPicker label="Currency" value="EUR" locale="en" />);
    expect(screen.getByText('Euro')).toBeTruthy();
    expect(screen.getByText('🇪🇺', { includeHiddenElements: true })).toBeTruthy();
    expect(screen.queryByText('🇪🇺')).toBeNull();
  });

  it('finds a currency by its symbol or code and selects it', async () => {
    const onChange = jest.fn();
    await render(<CurrencyPicker label="Currency" locale="en" onChange={onChange} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Currency' }));
    await fireEvent.changeText(screen.getByLabelText('Search currencies'), '₪');
    await fireEvent.press(screen.getByText('Israeli New Shekel'));
    expect(onChange).toHaveBeenCalledWith('ILS', expect.objectContaining({ value: 'ILS', description: 'ILS · ₪' }));
  });

  it('lists preferred currencies first under their header', async () => {
    await render(<CurrencyPicker label="Currency" locale="en" currencies={['USD', 'EUR', 'GBP']} preferred={['GBP']} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Currency' }));
    expect(screen.getByText('Suggested')).toBeTruthy();
    expect(screen.getByText('All currencies')).toBeTruthy();
  });
});
