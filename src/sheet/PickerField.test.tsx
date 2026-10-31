import { Text } from 'react-native';

import { fireEvent, render, screen } from '@testing-library/react-native';

import { PickerField } from './PickerField';

const renderSheet = ({ visible, onClose }: { visible: boolean; onClose: () => void }) =>
  visible ? (
    <Text accessibilityRole="button" onPress={onClose}>
      Close sheet
    </Text>
  ) : null;

describe('PickerField', () => {
  it('shows the placeholder until there is a value', async () => {
    const { rerender } = await render(<PickerField placeholder="Pick a day">{renderSheet}</PickerField>);
    expect(screen.getByText('Pick a day')).toBeTruthy();
    await rerender(
      <PickerField placeholder="Pick a day" displayValue="Oct 26, 2026">
        {renderSheet}
      </PickerField>
    );
    expect(screen.getByText('Oct 26, 2026')).toBeTruthy();
  });

  it('opens the sheet on press and closes it from inside', async () => {
    const onOpen = jest.fn();
    const onClose = jest.fn();
    await render(
      <PickerField label="Due" onOpen={onOpen} onClose={onClose}>
        {renderSheet}
      </PickerField>
    );
    expect(screen.queryByText('Close sheet')).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: 'Due' }));
    expect(onOpen).toHaveBeenCalled();
    await fireEvent.press(screen.getByText('Close sheet'));
    expect(onClose).toHaveBeenCalled();
    expect(screen.queryByText('Close sheet')).toBeNull();
  });

  it('does not open when disabled', async () => {
    await render(
      <PickerField label="Due" disabled>
        {renderSheet}
      </PickerField>
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Due' }));
    expect(screen.queryByText('Close sheet')).toBeNull();
  });

  it('clears only while there is a value', async () => {
    const onClear = jest.fn();
    const { rerender } = await render(
      <PickerField clearable onClear={onClear}>
        {renderSheet}
      </PickerField>
    );
    expect(screen.queryByLabelText('Clear')).toBeNull();
    await rerender(
      <PickerField clearable onClear={onClear} displayValue="9:30 AM">
        {renderSheet}
      </PickerField>
    );
    await fireEvent.press(screen.getByLabelText('Clear'));
    expect(onClear).toHaveBeenCalled();
  });

  it('shows the helper text, replaced by the error message, and keeps both out of the sheet', async () => {
    const { rerender } = await render(
      <PickerField label="Due" required helperText="Within 30 days">
        {renderSheet}
      </PickerField>
    );
    expect(screen.getByText('Within 30 days')).toBeTruthy();
    expect(screen.getByText('Due *')).toBeTruthy();
    await rerender(
      <PickerField label="Due" required helperText="Within 30 days" error="Pick a date">
        {renderSheet}
      </PickerField>
    );
    expect(screen.queryByText('Within 30 days')).toBeNull();
    expect(screen.getByText('Pick a date')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Due, required' }).props.accessibilityHint).toBe('Pick a date');
  });

  it('renders a custom trigger that can open the sheet', async () => {
    await render(
      <PickerField displayValue="🍕" renderTrigger={({ open, displayValue }) => <Text onPress={open}>Emoji: {displayValue}</Text>}>
        {renderSheet}
      </PickerField>
    );
    await fireEvent.press(screen.getByText('Emoji: 🍕'));
    expect(screen.getByText('Close sheet')).toBeTruthy();
  });

  it('passes the error to a custom trigger', async () => {
    await render(
      <PickerField error="Pick an emoji" renderTrigger={({ error }) => <Text>{error ? 'invalid' : 'valid'}</Text>}>
        {renderSheet}
      </PickerField>
    );
    expect(screen.getByText('invalid')).toBeTruthy();
  });
});
