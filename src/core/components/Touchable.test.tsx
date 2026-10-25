import { Text } from 'react-native';

import { fireEvent, render, screen } from '@testing-library/react-native';

import { lightTheme } from '../theme/theme.constants';
import { Touchable } from './Touchable';

describe('Touchable', () => {
  it('keeps the caller’s press and hover handlers alongside its own', async () => {
    const onPress = jest.fn();
    const onPressIn = jest.fn();
    const onHoverIn = jest.fn();
    await render(
      <Touchable theme={lightTheme} onPress={onPress} onPressIn={onPressIn} onHoverIn={onHoverIn} accessibilityRole="button">
        <Text>Apple</Text>
      </Touchable>
    );
    const button = screen.getByRole('button');
    await fireEvent(button, 'pressIn', { nativeEvent: { pageX: 0, pageY: 0 } });
    await fireEvent(button, 'hoverIn');
    await fireEvent.press(button);
    expect(onPressIn).toHaveBeenCalled();
    expect(onHoverIn).toHaveBeenCalled();
    expect(onPress).toHaveBeenCalled();
  });

  it('renders state-driven children and ignores presses when disabled', async () => {
    const onPress = jest.fn();
    await render(
      <Touchable theme={lightTheme} disabled ripple={false} onPress={onPress} accessibilityRole="button">
        {({ pressed }) => <Text>{pressed ? 'down' : 'up'}</Text>}
      </Touchable>
    );
    expect(screen.getByText('up')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
