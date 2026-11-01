import React from 'react';
import { Text } from 'react-native';

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { SelectPicker } from './SelectPicker';
import type { SelectOption } from './select.types';

const options: SelectOption<string>[] = ['React', 'TypeScript', 'Expo'].map((label) => ({
  label,
  value: label.toLowerCase(),
}));

const CreatablePicker = ({ onClose }: { onClose: () => void }) => {
  const [value, setValue] = React.useState<string | null>(null);
  return (
    <SelectPicker
      label="Stack"
      options={options}
      searchable
      value={value}
      onChange={setValue}
      onCreate={(text) => ({
        label: text,
        value: text.toLowerCase(),
      })}
      onClose={onClose}
    />
  );
};

describe('SelectPicker', () => {
  it('shows the placeholder until something is selected', async () => {
    const { rerender } = await render(<SelectPicker label="Stack" placeholder="Pick one" options={options} value={null} />);
    expect(screen.getByText('Pick one')).toBeTruthy();
    await rerender(<SelectPicker label="Stack" placeholder="Pick one" options={options} value="expo" />);
    expect(screen.getByText('Expo')).toBeTruthy();
  });

  it('shows the error message under the field and announces it', async () => {
    await render(<SelectPicker label="Stack" options={options} value={null} required error="Pick a stack" />);
    expect(screen.getByText('Pick a stack')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Stack, required' }).props.accessibilityHint).toBe('Pick a stack');
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
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('creates an option from the search, selects it and shows it before options include it', async () => {
    const onClose = jest.fn();
    await render(<CreatablePicker onClose={onClose} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Stack' }));
    await fireEvent.changeText(screen.getByLabelText('Search'), 'Svelte');
    await fireEvent.press(screen.getByRole('button', { name: 'Add "Svelte"' }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(screen.getByText('Svelte')).toBeTruthy();
  });

  it('keeps the selected label when new options no longer include it', async () => {
    const { rerender } = await render(<SelectPicker options={options} value="expo" />);
    await rerender(<SelectPicker options={options.slice(0, 1)} value="expo" />);
    expect(screen.getByText('Expo')).toBeTruthy();
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

  it('passes the open state to a custom chevron', async () => {
    await render(
      <SelectPicker label="Stack" options={options} renderChevron={({ open }) => <Text>{open ? 'chevron open' : 'chevron closed'}</Text>} />
    );
    expect(screen.getByText('chevron closed')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Stack' }));
    expect(screen.getByText('chevron open')).toBeTruthy();
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
      await waitFor(() => expect(onClose).toHaveBeenCalled());
      await waitFor(() => expect(screen.queryByLabelText('Expo')).toBeNull());
    });

    it('filters as the user types in the field, and clears the query on close', async () => {
      const onChange = jest.fn();
      await render(<SelectPicker label="Stack" presentation="dropdown" options={options} value="react" onChange={onChange} />);
      await fireEvent.press(screen.getByRole('button', { name: 'Stack' }));
      await fireEvent.changeText(screen.getByPlaceholderText('React'), 'type');
      expect(screen.queryByLabelText('Expo')).toBeNull();
      await fireEvent.press(screen.getByLabelText('TypeScript'));
      expect(onChange).toHaveBeenCalledWith('typescript', options[1]);
      await waitFor(() => expect(screen.queryByLabelText('TypeScript')).toBeNull());
      await fireEvent.press(screen.getByRole('button', { name: 'Stack' }));
      expect(screen.getByLabelText('Expo')).toBeTruthy();
    });

    it('loads options as the user types in the field, and keeps the chosen label after closing', async () => {
      const loadOptions = jest.fn((query: string) => Promise.resolve([{ label: `${query} City`, value: query }]));
      const onChange = jest.fn();
      const { rerender } = await render(
        <SelectPicker label="City" presentation="dropdown" loadOptions={loadOptions} searchDebounce={0} onChange={onChange} />
      );
      await fireEvent.press(screen.getByRole('button', { name: 'City' }));
      await fireEvent.changeText(screen.getByPlaceholderText('Search'), 'par');
      await act(() => new Promise<void>((resolve) => setTimeout(resolve, 0)));
      await fireEvent.press(screen.getByLabelText('par City'));
      expect(onChange).toHaveBeenCalledWith('par', { label: 'par City', value: 'par' });
      await rerender(<SelectPicker label="City" presentation="dropdown" loadOptions={loadOptions} searchDebounce={0} value="par" />);
      await waitFor(() => expect(screen.getByText('par City')).toBeTruthy());
    });

    it('keeps the field read-only with searchable={false}', async () => {
      await render(<SelectPicker label="Stack" presentation="dropdown" searchable={false} options={options} />);
      await fireEvent.press(screen.getByRole('button', { name: 'Stack' }));
      expect(screen.queryByPlaceholderText('Search')).toBeNull();
      expect(screen.getByLabelText('Expo')).toBeTruthy();
    });

    it('closes on a tap outside without changing the value', async () => {
      const onChange = jest.fn();
      await render(<SelectPicker label="Stack" presentation="dropdown" multiple options={options} onChange={onChange} />);
      await fireEvent.press(screen.getByRole('button', { name: 'Stack' }));
      expect(screen.getByLabelText('React')).toBeTruthy();
      await fireEvent.press(screen.getByLabelText('Close'));
      await waitFor(() => expect(screen.queryByLabelText('React')).toBeNull());
      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
