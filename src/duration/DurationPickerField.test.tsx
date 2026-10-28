import { fireEvent, render, screen } from '@testing-library/react-native';

import { DurationPickerField } from './DurationPickerField';

describe('DurationPickerField', () => {
  it('shows the exact duration and confirms what the wheels show, snapped to the interval', async () => {
    const onConfirm = jest.fn();
    const onClose = jest.fn();
    await render(<DurationPickerField label="Timer" value={5520} minuteInterval={5} onConfirm={onConfirm} onClose={onClose} />);
    expect(screen.getByText('1 h 32 min')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Timer' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Done' }));
    expect(onConfirm).toHaveBeenCalledWith(5400);
    expect(onClose).toHaveBeenCalled();
  });

  it('shows the placeholder until there is a value', async () => {
    await render(<DurationPickerField label="Timer" placeholder="Set a timer" onConfirm={jest.fn()} />);
    expect(screen.getByText('Set a timer')).toBeTruthy();
  });
});
