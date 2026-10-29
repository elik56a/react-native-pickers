import { Pressable, Text } from 'react-native';

import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { Menu } from './Menu';

describe('Menu', () => {
  // The preset's View mock shares these instance methods; measureInWindow never calls back unless told to.
  const { measureInWindow }: { measureInWindow: jest.Mock } = jest.requireActual(
    '@react-native/jest-preset/jest/MockNativeMethods'
  ).default;
  beforeEach(() => {
    jest.useFakeTimers();
    measureInWindow.mockImplementation((callback: (...rect: number[]) => void) => callback(300, 100, 40, 40));
  });
  afterEach(() => {
    measureInWindow.mockReset();
    jest.useRealTimers();
  });

  const finishAnimations = async () => {
    await act(async () => {
      jest.runAllTimers();
    });
  };

  it('opens from its trigger and runs the action after closing', async () => {
    const onPress = jest.fn();
    const onClose = jest.fn();
    await render(
      <Menu actions={[{ label: 'Rename', onPress }]} onClose={onClose} accessibilityLabel="More options">
        <Text>⋯</Text>
      </Menu>
    );
    expect(screen.queryByRole('button', { name: 'Rename' })).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: 'More options' }));
    expect(screen.getByRole('button', { name: 'More options', expanded: true })).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Rename' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
    await finishAnimations();
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button', { name: 'Rename' })).toBeNull();
  });

  it('opens on a long press as a context menu', async () => {
    await render(
      <Menu actions={[{ label: 'Copy' }]} openOnLongPress accessibilityLabel="Message">
        <Text>Hello</Text>
      </Menu>
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Message' }));
    expect(screen.queryByRole('button', { name: 'Copy' })).toBeNull();
    await fireEvent(screen.getByRole('button', { name: 'Message' }), 'longPress');
    expect(screen.getByRole('button', { name: 'Copy' })).toBeTruthy();
  });

  it('hands a function trigger open()', async () => {
    await render(
      <Menu actions={[{ label: 'Share' }]} title="Photo">
        {({ open }) => (
          <Pressable onPress={open} accessibilityRole="button">
            <Text>Options</Text>
          </Pressable>
        )}
      </Menu>
    );
    await fireEvent.press(screen.getByText('Options'));
    expect(screen.getByRole('header', { name: 'Photo' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Share' })).toBeTruthy();
  });

  it('stays shut while disabled', async () => {
    const onOpen = jest.fn();
    await render(
      <Menu actions={[{ label: 'Share' }]} disabled onOpen={onOpen} accessibilityLabel="More">
        <Text>⋯</Text>
      </Menu>
    );
    await fireEvent.press(screen.getByRole('button', { name: 'More' }));
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('opens as an action sheet', async () => {
    await render(
      <Menu actions={[{ label: 'Share' }]} presentation="sheet" design="ios" accessibilityLabel="More">
        <Text>⋯</Text>
      </Menu>
    );
    await fireEvent.press(screen.getByRole('button', { name: 'More' }));
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeTruthy();
  });
});
