import { fireEvent, render, screen } from '@testing-library/react-native';

import { ColorPickerField } from './ColorPickerField';

describe('ColorPickerField', () => {
  it('shows the colour and confirms a new one from the sheet', async () => {
    const onConfirm = jest.fn();
    await render(<ColorPickerField label="Label colour" value="#e4572e" onConfirm={onConfirm} design="material" />);
    expect(screen.getByText('#E4572E')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Label colour' }));
    await fireEvent.press(screen.getByLabelText('Green'));
    await fireEvent.press(screen.getByRole('button', { name: 'OK' }));
    expect(onConfirm).toHaveBeenCalledWith('#4CAF50');
  });
});
