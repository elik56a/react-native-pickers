import type React from 'react';
import type { GestureResponderEvent, PanResponderCallbacks, PanResponderGestureState } from 'react-native';
import { PanResponder, StyleSheet, Text } from 'react-native';

import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { Rating } from './Rating';

const touchAt = (x: number) => ({ nativeEvent: { locationX: x, locationY: 22 } }) as unknown as GestureResponderEvent;
const moved = (dx: number) =>
  ({
    dx,
    dy: 0,
  }) as PanResponderGestureState;
const key = (k: string) => ({
  nativeEvent: { key: k },
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
});
/** How wide the filled star over star `index` is, in px; 0 when it's empty. */
const fillOf = (index: number) => {
  const fill = screen.getByTestId(`rating-star-${index}`).props.children[1];
  return fill ? StyleSheet.flatten(fill.props.style).width : 0;
};

/** Renders the row laid out as five 32 px stars 4 px apart: each star starts every 36 px. */
const renderRating = async (ui: React.ReactElement, width = 176) => {
  const spy = jest.spyOn(PanResponder, 'create');
  await render(ui);
  await fireEvent(screen.getByTestId('rating'), 'layout', { nativeEvent: { layout: { x: 0, y: 0, width, height: 44 } } });
  return spy.mock.calls[0]?.[0] as PanResponderCallbacks;
};

describe('Rating', () => {
  afterEach(() => jest.restoreAllMocks());

  it('rates the star tapped', async () => {
    const onChange = jest.fn();
    const pan = await renderRating(<Rating onChange={onChange} testID="rating" />);
    await act(() => pan.onPanResponderGrant?.(touchAt(80), moved(0)));
    await act(() => pan.onPanResponderRelease?.(touchAt(80), moved(0)));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('ignores a tap in the empty row after the stars', async () => {
    const onChange = jest.fn();
    const pan = await renderRating(<Rating onChange={onChange} testID="rating" />, 300);
    await act(() => pan.onPanResponderGrant?.(touchAt(250), moved(0)));
    await act(() => pan.onPanResponderRelease?.(touchAt(250), moved(0)));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('previews a drag and commits once on release, in half steps', async () => {
    const onChange = jest.fn();
    const pan = await renderRating(<Rating step={0.5} onChange={onChange} testID="rating" />);
    const start = touchAt(10);
    await act(() => pan.onPanResponderGrant?.(start, moved(0)));
    await act(() => pan.onPanResponderMove?.(start, moved(105)));
    expect(onChange).not.toHaveBeenCalled();
    expect(fillOf(3)).toBe(16);
    await act(() => pan.onPanResponderRelease?.(start, moved(105)));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(3.5);
  });

  it('steps with keys and screen-reader actions', async () => {
    const onChange = jest.fn();
    await render(<Rating defaultValue={3} onChange={onChange} testID="rating" />);
    const row = screen.getByRole('adjustable', { name: 'Rating' });
    expect(row.props.accessibilityValue).toEqual({ text: '3 of 5' });
    await fireEvent(row, 'keyDown', key('ArrowRight'));
    expect(onChange).toHaveBeenLastCalledWith(4);
    await fireEvent(row, 'accessibilityAction', { nativeEvent: { actionName: 'decrement' } });
    expect(onChange).toHaveBeenLastCalledWith(3);
    await fireEvent(row, 'keyDown', key('Home'));
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it('shows any fraction read-only and takes no touches', async () => {
    await render(<Rating value={4.25} readOnly testID="rating" />);
    expect(fillOf(4)).toBe(8);
    expect(screen.getByTestId('rating').props.onResponderGrant).toBeUndefined();
    expect(screen.getByLabelText('Rating').props.accessibilityValue).toEqual({ text: '4.25 of 5' });
  });

  it('draws a custom icon empty and filled', async () => {
    await render(<Rating defaultValue={1} max={2} renderIcon={({ filled }) => <Text>{filled ? '♥' : '♡'}</Text>} />);
    expect(screen.getAllByText('♥')).toHaveLength(1);
    expect(screen.getAllByText('♡')).toHaveLength(2);
  });

  it('follows a controlled value without reporting it back', async () => {
    const onChange = jest.fn();
    const { rerender } = await render(<Rating value={1} onChange={onChange} testID="rating" />);
    await rerender(<Rating value={4} onChange={onChange} testID="rating" />);
    expect(screen.getByRole('adjustable').props.accessibilityValue).toEqual({ text: '4 of 5' });
    expect(onChange).not.toHaveBeenCalled();
  });
});
