import { useState } from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { ActionSheet } from './ActionSheet';
import type { ActionSheetAction, ActionSheetProps } from './action.types';

const Harness = (props: Partial<ActionSheetProps>) => {
  const [visible, setVisible] = useState(true);
  return <ActionSheet visible={visible} onClose={() => setVisible(false)} actions={[]} {...props} />;
};

const finishAnimations = async () => {
  await act(async () => {
    jest.runAllTimers();
  });
};

describe('ActionSheet', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('runs an action after the sheet has closed', async () => {
    const onPress = jest.fn();
    await render(<Harness actions={[{ label: 'Share', onPress }]} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Share' }));
    expect(onPress).not.toHaveBeenCalled();
    await finishAnimations();
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button', { name: 'Share' })).toBeNull();
  });

  it('closes on Cancel without running an action', async () => {
    const onPress = jest.fn();
    await render(<Harness design="ios" actions={[{ label: 'Share', onPress }]} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Cancel' }));
    await finishAnimations();
    expect(onPress).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull();
  });

  it('shows Cancel by default in the iOS design only', async () => {
    const { rerender } = await render(<ActionSheet visible onClose={jest.fn()} actions={[]} design="material" />);
    expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull();
    await rerender(<ActionSheet visible onClose={jest.fn()} actions={[]} design="material" showCancel cancelLabel="Dismiss" />);
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeTruthy();
  });

  it('ignores a disabled action', async () => {
    const onClose = jest.fn();
    const action: ActionSheetAction = { label: 'Edit', disabled: true, onPress: jest.fn() };
    await render(<ActionSheet visible onClose={onClose} actions={[action]} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Edit' }));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('shows the title as a header and the message', async () => {
    await render(<ActionSheet visible onClose={jest.fn()} actions={[]} title="Delete photo?" message="It goes from all your devices." />);
    expect(screen.getByRole('header', { name: 'Delete photo?' })).toBeTruthy();
    expect(screen.getByText('It goes from all your devices.')).toBeTruthy();
  });

  it('marks the selected action and reads its description', async () => {
    await render(
      <ActionSheet
        visible
        onClose={jest.fn()}
        actions={[
          { label: 'Newest', selected: true },
          { label: 'Price', description: 'Lowest first' },
        ]}
      />
    );
    expect(screen.getByRole('button', { name: 'Newest', selected: true })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Price, Lowest first', selected: false })).toBeTruthy();
    expect(screen.getByText('✓')).toBeTruthy();
  });

  it('still calls sheetProps.onClosed', async () => {
    const onClosed = jest.fn();
    await render(<Harness actions={[{ label: 'Share' }]} sheetProps={{ onClosed }} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Share' }));
    await finishAnimations();
    expect(onClosed).toHaveBeenCalledTimes(1);
  });
});
