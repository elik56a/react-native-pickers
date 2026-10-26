import { Text } from 'react-native';

import { fireEvent, render, screen } from '@testing-library/react-native';

import { lightTheme } from '../../core';
import { FieldTrigger } from './FieldTrigger';

const renderTrigger = (props: Partial<React.ComponentProps<typeof FieldTrigger>> = {}) =>
  render(
    <FieldTrigger
      displayValue=""
      placeholder="Pick one"
      label="Size"
      open={false}
      disabled={false}
      clearable={false}
      onOpen={jest.fn()}
      theme={lightTheme}
      {...props}
    />
  );

describe('FieldTrigger', () => {
  it('shows the placeholder without a value, and the value with its icon once set', async () => {
    const { rerender } = await renderTrigger();
    expect(screen.getByText('Pick one')).toBeTruthy();
    await rerender(
      <FieldTrigger
        displayValue="Large"
        icon={<Text>📏</Text>}
        placeholder="Pick one"
        open={false}
        disabled={false}
        clearable={false}
        onOpen={jest.fn()}
        theme={lightTheme}
      />
    );
    expect(screen.queryByText('Pick one')).toBeNull();
    expect(screen.getByText('Large')).toBeTruthy();
    expect(screen.getByText('📏')).toBeTruthy();
  });

  it('renders children in place of the value', async () => {
    await renderTrigger({ displayValue: 'Large', children: <Text>chips</Text> });
    expect(screen.getByText('chips')).toBeTruthy();
    expect(screen.queryByText('Large')).toBeNull();
  });

  it('opens on press, with the value as hint and the open state exposed', async () => {
    const onOpen = jest.fn();
    await renderTrigger({ displayValue: 'Large', open: true, onOpen });
    const button = screen.getByRole('button', { name: 'Size' });
    expect(button.props.accessibilityHint).toBe('Large');
    expect(button.props.accessibilityState).toMatchObject({ expanded: true });
    await fireEvent.press(button);
    expect(onOpen).toHaveBeenCalled();
  });

  it('shows clear only when clearable, with a value and enabled', async () => {
    const onClear = jest.fn();
    const { rerender } = await renderTrigger({ clearable: true, onClear });
    expect(screen.queryByLabelText('Clear')).toBeNull();
    const props = { placeholder: 'Pick one', open: false, clearable: true, onClear, onOpen: jest.fn(), theme: lightTheme };
    await rerender(<FieldTrigger {...props} displayValue="Large" disabled />);
    expect(screen.queryByLabelText('Clear')).toBeNull();
    await rerender(<FieldTrigger {...props} displayValue="Large" disabled={false} />);
    await fireEvent.press(screen.getByLabelText('Clear'));
    expect(onClear).toHaveBeenCalled();
  });

  it('does not open while disabled', async () => {
    const onOpen = jest.fn();
    await renderTrigger({ disabled: true, onOpen });
    await fireEvent.press(screen.getByRole('button', { name: 'Size' }));
    expect(onOpen).not.toHaveBeenCalled();
  });
});
