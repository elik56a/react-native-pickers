import { fireEvent, render, screen } from '@testing-library/react-native';

import { PhoneField } from './PhoneField';

const input = () => screen.getByLabelText('Phone');

describe('PhoneField', () => {
  it('groups the number as the country writes it, drops the trunk 0, and reports E.164', async () => {
    const onChange = jest.fn();
    await render(<PhoneField label="Phone" defaultCountry="IL" onChange={onChange} />);
    await fireEvent.changeText(input(), '0541234567');
    expect(input().props.value).toBe('54-123-4567');
    expect(onChange).toHaveBeenLastCalledWith('+972541234567', { country: 'IL', nationalNumber: '541234567', valid: true });
  });

  it('drops a separator with the digit after it, so backspace never sticks', async () => {
    await render(<PhoneField label="Phone" defaultValue="+12015550123" />);
    expect(input().props.value).toBe('(201) 555-0123');
    await fireEvent.changeText(input(), '(201) 555-0');
    expect(input().props.value).toBe('(201) 555-0');
    await fireEvent.changeText(input(), '(201) 555-');
    expect(input().props.value).toBe('(201) 555');
  });

  it('switches country for a pasted international number', async () => {
    const onCountryChange = jest.fn();
    await render(<PhoneField label="Phone" onCountryChange={onCountryChange} />);
    await fireEvent.changeText(input(), '+44 7911 123456');
    expect(onCountryChange).toHaveBeenCalledWith('GB');
    expect(input().props.value).toBe('7911 123456');
    expect(screen.getByRole('button', { name: 'Country code: United Kingdom +44' })).toBeTruthy();
  });

  it('keeps every digit when another country is picked, and says if it no longer fits', async () => {
    const onChange = jest.fn();
    await render(<PhoneField label="Phone" locale="en" defaultValue="+12015550123" onChange={onChange} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Country code: United States +1' }));
    await fireEvent.changeText(screen.getByLabelText('Search countries'), 'France');
    await fireEvent.press(screen.getByLabelText('France'));
    expect(onChange).toHaveBeenLastCalledWith('+332015550123', { country: 'FR', nationalNumber: '2015550123', valid: false });
  });

  it('follows a controlled value without reporting it back', async () => {
    const onChange = jest.fn();
    const { rerender } = await render(<PhoneField label="Phone" value="" onChange={onChange} />);
    await rerender(<PhoneField label="Phone" value="+33612345678" onChange={onChange} />);
    expect(input().props.value).toBe('6 12 34 56 78');
    expect(onChange).not.toHaveBeenCalled();
  });
});
