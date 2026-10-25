import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { WheelPickerSheet } from './WheelPickerSheet';

const H = 40;

describe('WheelPickerSheet', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('confirms the scrolled value on Done', async () => {
    const onConfirm = jest.fn();
    const onClose = jest.fn();
    await render(<WheelPickerSheet visible items={[1, 2, 3]} onClose={onClose} onConfirm={onConfirm} testID="wheel" />);
    await fireEvent.scroll(screen.getByTestId('wheel-list'), { nativeEvent: { contentOffset: { y: 2 * H } } });
    await act(() => jest.advanceTimersByTime(500));
    expect(onConfirm).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('button', { name: 'Done' }));
    expect(onConfirm).toHaveBeenCalledWith(3);
    expect(onClose).toHaveBeenCalled();
  });

  it('confirms the first item when nothing was scrolled', async () => {
    const onConfirm = jest.fn();
    await render(<WheelPickerSheet visible items={['a', 'b']} onClose={jest.fn()} onConfirm={onConfirm} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Done' }));
    expect(onConfirm).toHaveBeenCalledWith('a');
  });

  it('cancels without confirming', async () => {
    const onConfirm = jest.fn();
    const onClose = jest.fn();
    await render(<WheelPickerSheet visible items={[1, 2]} value={2} onClose={onClose} onConfirm={onConfirm} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
