import { fireEvent, render, screen } from '@testing-library/react-native';

import { AmountField } from './AmountField';

const input = (name = 'Price, US Dollar') => screen.getByLabelText(name);

describe('AmountField', () => {
  it('groups the amount as the user types, keeps a trailing point, and reports the number', async () => {
    const onChange = jest.fn();
    await render(<AmountField label="Price" locale="en-US" onChange={onChange} />);
    await fireEvent.changeText(input(), '1234');
    expect(input().props.value).toBe('1,234');
    await fireEvent.changeText(input(), '1,234.');
    expect(input().props.value).toBe('1,234.');
    await fireEvent.changeText(input(), '1,234.5');
    expect(onChange.mock.calls).toEqual([[1234], [1234.5]]);
  });

  it('settles to every decimal place when typing ends', async () => {
    await render(<AmountField label="Price" locale="en-US" />);
    await fireEvent(input(), 'focus');
    await fireEvent.changeText(input(), '12.5');
    await fireEvent(input(), 'blur');
    expect(input().props.value).toBe('12.50');
  });

  it("takes the currency's decimal places, symbol and its side for the locale", async () => {
    await render(<AmountField label="Price" locale="de-DE" defaultCurrency="EUR" defaultValue={1234.5} />);
    expect(input('Price, Euro').props.value).toBe('1.234,50');
    expect(input('Price, Euro').props.placeholder).toBe('0,00');
    expect(screen.getByText('€')).toBeTruthy();
    await fireEvent.changeText(input('Price, Euro'), '1.234,567');
    expect(input('Price, Euro').props.value).toBe('1.234,56');
  });

  it('follows a controlled value without reporting it back', async () => {
    const onChange = jest.fn();
    const { rerender } = await render(<AmountField label="Price" locale="en-US" value={null} onChange={onChange} />);
    await rerender(<AmountField label="Price" locale="en-US" value={99.9} onChange={onChange} />);
    expect(input().props.value).toBe('99.90');
    expect(onChange).not.toHaveBeenCalled();
  });

  it("reformats a controlled value for a new currency's decimal places without reporting it", async () => {
    const onChange = jest.fn();
    const { rerender } = await render(<AmountField label="Price" locale="en-US" currency="USD" value={12.5} onChange={onChange} />);
    expect(input().props.value).toBe('12.50');
    await rerender(<AmountField label="Price" locale="en-US" currency="KWD" value={12.5} onChange={onChange} />);
    expect(input('Price, Kuwaiti Dinar').props.value).toBe('12.500');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('shows the symbol and placeholder of an empty Material field without a label', async () => {
    await render(<AmountField design="material" locale="en-US" />);
    expect(screen.getByText('$')).toBeTruthy();
    expect(input('Amount, US Dollar').props.placeholder).toBe('0.00');
  });

  it("picks another currency from its button, and drops decimals the new one doesn't have", async () => {
    const onChange = jest.fn();
    const onCurrencyChange = jest.fn();
    await render(
      <AmountField
        label="Price"
        locale="en-US"
        showCurrencyPicker
        defaultValue={12.5}
        onChange={onChange}
        onCurrencyChange={onCurrencyChange}
      />
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Currency: US Dollar' }));
    await fireEvent.changeText(screen.getByLabelText('Search currencies'), 'yen');
    await fireEvent.press(screen.getByText('Japanese Yen'));
    expect(onCurrencyChange).toHaveBeenCalledWith('JPY');
    expect(onChange).toHaveBeenLastCalledWith(12);
    expect(input('Price, Japanese Yen').props.value).toBe('12');
  });

  it('draws a large amount over a hidden input, with the message centered under it', async () => {
    await render(<AmountField variant="large" label="Send" locale="en-US" defaultValue={42} error="Over your balance" />);
    expect(screen.getByText('$')).toBeTruthy();
    expect(screen.getByText('42')).toBeTruthy();
    expect(screen.getByText('Over your balance')).toBeTruthy();
    expect(input('Send, US Dollar').props.accessibilityHint).toBe('Over your balance');
  });
});
