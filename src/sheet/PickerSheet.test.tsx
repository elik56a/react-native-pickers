import { Text } from 'react-native';

import { fireEvent, render, screen } from '@testing-library/react-native';

import { BottomSheet } from './BottomSheet';
import { PickerSheet } from './PickerSheet';

describe('BottomSheet', () => {
  it('renders nothing until visible', async () => {
    const { rerender } = await render(
      <BottomSheet visible={false} onClose={jest.fn()} title="Pick">
        <Text>Body</Text>
      </BottomSheet>
    );
    expect(screen.queryByText('Body')).toBeNull();
    await rerender(
      <BottomSheet visible onClose={jest.fn()} title="Pick">
        <Text>Body</Text>
      </BottomSheet>
    );
    expect(screen.getByText('Body')).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Pick' })).toBeTruthy();
  });

  it('closes on backdrop press unless disabled', async () => {
    const onClose = jest.fn();
    const { rerender } = await render(
      <BottomSheet visible onClose={onClose}>
        <Text>Body</Text>
      </BottomSheet>
    );
    await fireEvent.press(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
    await rerender(
      <BottomSheet visible onClose={onClose} closeOnBackdropPress={false}>
        <Text>Body</Text>
      </BottomSheet>
    );
    await fireEvent.press(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('PickerSheet', () => {
  it('cancels and confirms from the header', async () => {
    const onClose = jest.fn();
    const onConfirm = jest.fn();
    await render(
      <PickerSheet visible onClose={onClose} onConfirm={onConfirm} confirmLabel="Save">
        <Text>Body</Text>
      </PickerSheet>
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('button', { name: 'Save' }));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('ignores a disabled confirm and can hide cancel', async () => {
    const onConfirm = jest.fn();
    await render(
      <PickerSheet visible onClose={jest.fn()} onConfirm={onConfirm} confirmDisabled showCancel={false}>
        <Text>Body</Text>
      </PickerSheet>
    );
    expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: 'Done' }));
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
