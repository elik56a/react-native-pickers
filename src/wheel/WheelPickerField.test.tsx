import { fireEvent, render, screen } from '@testing-library/react-native';

import { WheelPickerField } from './WheelPickerField';

const sizes = [
  { label: 'Small', value: 's' },
  { label: 'Large', value: 'l' },
];

describe('WheelPickerField', () => {
  it("shows the item's label and confirms from the sheet", async () => {
    const onConfirm = jest.fn();
    await render(<WheelPickerField label="Size" items={sizes} value="l" onConfirm={onConfirm} />);
    expect(screen.getByText('Large')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Size' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Done' }));
    expect(onConfirm).toHaveBeenCalledWith('l');
  });

  it('clears through onClear', async () => {
    const onClear = jest.fn();
    await render(<WheelPickerField items={sizes} value="s" clearable onClear={onClear} onConfirm={jest.fn()} />);
    await fireEvent.press(screen.getByLabelText('Clear'));
    expect(onClear).toHaveBeenCalled();
  });
});
