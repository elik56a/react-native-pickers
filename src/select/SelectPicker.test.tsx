import { Text } from 'react-native';

import { fireEvent, render, screen } from '@testing-library/react-native';

import { SelectPicker } from './SelectPicker';
import type { SelectOption } from './select.types';

const options: SelectOption<string>[] = ['React', 'TypeScript', 'Expo'].map((label) => ({
  label,
  value: label.toLowerCase(),
}));

describe('SelectPicker', () => {
  it('shows the placeholder until something is selected', async () => {
    const { rerender } = await render(<SelectPicker label="Stack" placeholder="Pick one" options={options} value={null} />);
    expect(screen.getByText('Pick one')).toBeTruthy();
    await rerender(<SelectPicker label="Stack" placeholder="Pick one" options={options} value="expo" />);
    expect(screen.getByText('Expo')).toBeTruthy();
  });

  it('opens the sheet, selects and closes in single mode', async () => {
    const onChange = jest.fn();
    const onOpen = jest.fn();
    const onClose = jest.fn();
    await render(<SelectPicker label="Stack" options={options} onChange={onChange} onOpen={onOpen} onClose={onClose} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Stack' }));
    expect(onOpen).toHaveBeenCalled();
    await fireEvent.press(screen.getByLabelText('TypeScript'));
    expect(onChange).toHaveBeenCalledWith('typescript', options[1]);
    expect(onClose).toHaveBeenCalled();
  });

  it('does not open when disabled', async () => {
    const onOpen = jest.fn();
    await render(<SelectPicker label="Stack" options={options} disabled onOpen={onOpen} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Stack' }));
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('removes a chip in multiple mode', async () => {
    const onChange = jest.fn();
    await render(<SelectPicker multiple options={options} value={['react', 'expo']} onChange={onChange} />);
    await fireEvent.press(screen.getByLabelText('Remove React'));
    expect(onChange).toHaveBeenCalledWith(['expo'], [options[2]]);
  });

  it('clears everything with the clear button', async () => {
    const onChange = jest.fn();
    const onClear = jest.fn();
    await render(<SelectPicker multiple clearable options={options} value={['react']} onChange={onChange} onClear={onClear} />);
    await fireEvent.press(screen.getByLabelText('Clear'));
    expect(onChange).toHaveBeenCalledWith([], []);
    expect(onClear).toHaveBeenCalled();
  });

  it('renders a custom trigger that can open the sheet', async () => {
    const onOpen = jest.fn();
    await render(
      <SelectPicker
        options={options}
        onOpen={onOpen}
        renderTrigger={({ open, selected }) => <Text onPress={open}>{selected.length} selected</Text>}
        value="react"
      />
    );
    await fireEvent.press(screen.getByText('1 selected'));
    expect(onOpen).toHaveBeenCalled();
  });

  describe('dropdown', () => {
    // The preset's View mock shares these instance methods; measureInWindow never calls back unless told to.
    const { measureInWindow }: { measureInWindow: jest.Mock } = jest.requireActual(
      '@react-native/jest-preset/jest/MockNativeMethods'
    ).default;
    beforeEach(() => measureInWindow.mockImplementation((callback: (...rect: number[]) => void) => callback(16, 100, 300, 48)));
    afterEach(() => measureInWindow.mockReset());

    it('opens under the field, selects and closes', async () => {
      const onChange = jest.fn();
      const onClose = jest.fn();
      await render(<SelectPicker label="Stack" presentation="dropdown" options={options} onChange={onChange} onClose={onClose} />);
      expect(screen.queryByLabelText('Expo')).toBeNull();
      await fireEvent.press(screen.getByRole('button', { name: 'Stack' }));
      await fireEvent.press(screen.getByLabelText('Expo'));
      expect(onChange).toHaveBeenCalledWith('expo', options[2]);
      expect(onClose).toHaveBeenCalled();
      expect(screen.queryByLabelText('Expo')).toBeNull();
    });

    it('closes on a tap outside without changing the value', async () => {
      const onChange = jest.fn();
      await render(<SelectPicker label="Stack" presentation="dropdown" multiple options={options} onChange={onChange} />);
      await fireEvent.press(screen.getByRole('button', { name: 'Stack' }));
      expect(screen.getByLabelText('React')).toBeTruthy();
      await fireEvent.press(screen.getByLabelText('Close'));
      expect(screen.queryByLabelText('React')).toBeNull();
      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
