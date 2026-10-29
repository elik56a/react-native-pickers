import { Pressable, Text } from 'react-native';

import { act, fireEvent, render, screen } from '@testing-library/react-native';

import type { ActionSheetOptions } from '../action.types';
import { useActionSheet } from './useActionSheet';

const Screen = ({ options }: { options: ActionSheetOptions }) => {
  const { show, actionSheet } = useActionSheet();
  return (
    <>
      <Pressable onPress={() => show(options)}>
        <Text>Open</Text>
      </Pressable>
      {actionSheet}
    </>
  );
};

describe('useActionSheet', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows the sheet on show(), and runs the action after it closes', async () => {
    const onPress = jest.fn();
    const onClose = jest.fn();
    await render(<Screen options={{ title: 'Photo', actions: [{ label: 'Share', onPress }], onClose }} />);
    expect(screen.queryByRole('button', { name: 'Share' })).toBeNull();
    await fireEvent.press(screen.getByText('Open'));
    await fireEvent.press(screen.getByRole('button', { name: 'Share' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    await act(async () => {
      jest.runAllTimers();
    });
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button', { name: 'Share' })).toBeNull();
  });
});
