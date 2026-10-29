import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { ColorPicker } from './ColorPicker';

const action = (actionName: string) => ({ nativeEvent: { actionName } });

describe('ColorPicker', () => {
  describe('iOS: tabs', () => {
    it('picks from the grid, and shows the colour beside your swatches', async () => {
      const onChange = jest.fn();
      await render(<ColorPicker defaultValue="#2196F3" onChange={onChange} design="ios" />);
      await fireEvent.press(screen.getByLabelText('#FFFFFF'));
      expect(onChange).toHaveBeenLastCalledWith('#FFFFFF');
      expect(screen.getByLabelText('#FFFFFF').props.accessibilityState).toMatchObject({ selected: true });
      await fireEvent.press(screen.getByLabelText('Teal'));
      expect(onChange).toHaveBeenLastCalledWith('#009688');
    });

    it('moves across the spectrum, and sets red, green and blue on the sliders', async () => {
      const onChange = jest.fn();
      await render(<ColorPicker defaultValue="#FF0000" onChange={onChange} design="ios" testID="color" />);
      await fireEvent.press(screen.getByText('Spectrum'));
      await fireEvent(screen.getByTestId('color-spectrum'), 'accessibilityAction', action('down'));
      expect(onChange.mock.lastCall?.[0]).not.toBe('#FF0000');
      await fireEvent.press(screen.getByText('Sliders'));
      expect(screen.getByTestId('color-red').props.accessibilityValue).toEqual({ text: expect.any(String) });
      await fireEvent.changeText(screen.getByTestId('color-hex'), '#336699');
      expect(screen.getByTestId('color-green').props.accessibilityValue).toEqual({ text: '102' });
    });
  });

  describe('Material: swatches', () => {
    it('picks a circle, and opens the custom colour from the last one', async () => {
      const onChange = jest.fn();
      await render(<ColorPicker defaultValue="#2196F3" onChange={onChange} design="material" testID="color" />);
      expect(screen.getByLabelText('Blue').props.accessibilityState).toMatchObject({ selected: true });
      expect(screen.queryByTestId('color-pad')).toBeNull();
      await fireEvent.press(screen.getByLabelText('Custom colour'));
      expect(screen.getByTestId('color-pad')).toBeTruthy();
      await fireEvent(screen.getByTestId('color-hue'), 'accessibilityAction', action('increment'));
      expect(onChange.mock.lastCall?.[0]).not.toBe('#2196F3');
    });

    it('opens on the custom colour for a colour off the palette', async () => {
      await render(<ColorPicker value="#123456" design="material" testID="color" />);
      expect(screen.getByLabelText('Custom colour').props.accessibilityState).toMatchObject({ selected: true, expanded: true });
      expect(screen.getByTestId('color-pad')).toBeTruthy();
    });
  });

  describe('web: spectrum', () => {
    it('steps the square, keeps the hue through grey, and takes a typed hex code', async () => {
      const onChange = jest.fn();
      await render(<ColorPicker defaultValue="#FF0000" onChange={onChange} design="web" testID="color" />);
      await fireEvent(screen.getByTestId('color-hue'), 'accessibilityAction', action('increment'));
      for (let i = 0; i < 40; i++) await fireEvent(screen.getByTestId('color-pad'), 'accessibilityAction', action('decrement'));
      expect(onChange).toHaveBeenLastCalledWith('#FFFFFF');
      expect(screen.getByTestId('color-hue').props.accessibilityValue).toEqual({ text: '10°' });
      await fireEvent.changeText(screen.getByTestId('color-hex'), 'f80');
      await fireEvent(screen.getByTestId('color-hex'), 'blur');
      expect(onChange).toHaveBeenLastCalledWith('#FF8800');
    });

    it('copies the hex code with onCopy, and says so', async () => {
      jest.useFakeTimers();
      const onCopy = jest.fn();
      await render(<ColorPicker value="#E4572E" onCopy={onCopy} design="web" testID="color" />);
      await fireEvent.press(screen.getByLabelText('Copy'));
      expect(onCopy).toHaveBeenCalledWith('#E4572E');
      expect(screen.getByLabelText('Copied')).toBeTruthy();
      await act(() => jest.advanceTimersByTime(2000));
      expect(screen.getByLabelText('Copy')).toBeTruthy();
      jest.useRealTimers();
    });

    it('has no copy button on native without onCopy', async () => {
      await render(<ColorPicker value="#E4572E" design="web" />);
      expect(screen.queryByLabelText('Copy')).toBeNull();
    });
  });

  it('adds opacity with showAlpha, as two more hex digits', async () => {
    const onChange = jest.fn();
    await render(<ColorPicker defaultValue="#FF0000" onChange={onChange} showAlpha design="web" testID="color" />);
    expect(screen.getByTestId('color-opacity').props.accessibilityValue).toEqual({ text: '100%' });
    await fireEvent(screen.getByTestId('color-opacity'), 'accessibilityAction', action('decrement'));
    expect(onChange.mock.lastCall?.[0]).toMatch(/^#FF0000[0-9A-F]{2}$/);
  });

  it('keeps the colour opaque without showAlpha', async () => {
    await render(<ColorPicker value="#FF000080" design="web" testID="color" />);
    expect(screen.getByTestId('color-hex').props.value).toBe('#FF0000');
  });

  it('shows only your swatches without showCustom, in any design', async () => {
    await render(<ColorPicker colors={['#111111', '#222222']} showCustom={false} design="ios" testID="color" />);
    expect(screen.getByLabelText('#111111')).toBeTruthy();
    expect(screen.queryByText('Grid')).toBeNull();
    expect(screen.queryByTestId('color-hex')).toBeNull();
  });
});
