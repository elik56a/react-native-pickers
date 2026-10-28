import { StyleSheet } from 'react-native';

import { fireEvent, render, screen } from '@testing-library/react-native';

import { lightTheme } from '../core/theme/theme.constants';
import type { Design } from '../core/theme/theme.types';
import { EmojiPicker } from './EmojiPicker';
import { EmojiPickerSheet } from './EmojiPickerSheet';
import { findEmoji } from './emojis';

const layoutGrid = () =>
  fireEvent(screen.getByTestId('emoji-grid'), 'layout', {
    nativeEvent: { layout: { width: 320, height: 300 } },
  });

/** Whether the category bar comes after the grid in the tree, i.e. at the bottom. */
type Node = ReturnType<typeof screen.getByTestId>;

const inOrder = (node: Node): Node[] => [node, ...node.children.flatMap((child) => (typeof child === 'string' ? [] : inOrder(child)))];

const barIsBelowGrid = () => {
  const nodes = inOrder(screen.getByTestId('emoji'));
  return nodes.indexOf(screen.getByRole('tab', { name: 'Food & Drink' })) > nodes.indexOf(screen.getByTestId('emoji-grid'));
};

const renderDesign = async (design: Design) => {
  await render(<EmojiPicker testID="emoji" onSelect={jest.fn()} design={design} />);
  await layoutGrid();
};

describe('EmojiPicker', () => {
  it('renders the grid once measured and selects an emoji', async () => {
    const onSelect = jest.fn();
    const onRecentChange = jest.fn();
    await render(<EmojiPicker testID="emoji" onSelect={onSelect} onRecentChange={onRecentChange} />);
    expect(screen.queryByLabelText('grinning face')).toBeNull();
    await layoutGrid();
    await fireEvent.press(screen.getByLabelText('grinning face'));
    expect(onSelect).toHaveBeenCalledWith('😀', findEmoji('😀'));
    expect(onRecentChange).toHaveBeenCalledWith(['😀']);
  });

  it('shows recent emojis as their own section', async () => {
    await render(<EmojiPicker testID="emoji" onSelect={jest.fn()} defaultRecent={['🍕']} />);
    await layoutGrid();
    expect(screen.getByText('Recently used')).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Recently used' })).toBeTruthy();
  });

  it('searches and shows the empty text', async () => {
    await render(<EmojiPicker testID="emoji" onSelect={jest.fn()} emptyText="Nothing" />);
    await layoutGrid();
    await fireEvent.changeText(screen.getByLabelText('Search emoji'), 'pizza');
    expect(screen.getByLabelText('pizza')).toBeTruthy();
    expect(screen.queryByRole('tab')).toBeNull();
    await fireEvent.changeText(screen.getByLabelText('Search emoji'), 'zzzz');
    expect(screen.getByText('Nothing')).toBeTruthy();
  });

  it('applies the chosen skin tone', async () => {
    const onSelect = jest.fn();
    const onSkinToneChange = jest.fn();
    await render(<EmojiPicker testID="emoji" onSelect={onSelect} onSkinToneChange={onSkinToneChange} />);
    await layoutGrid();
    await fireEvent.press(screen.getByLabelText('Skin tone'));
    await fireEvent.press(screen.getByLabelText('Skin tone 3'));
    expect(onSkinToneChange).toHaveBeenCalledWith(3);
    expect(screen.queryByLabelText('Skin tone 3')).toBeNull();
    await fireEvent.changeText(screen.getByLabelText('Search emoji'), 'waving hand');
    await fireEvent.press(screen.getByLabelText('waving hand'));
    expect(onSelect).toHaveBeenCalledWith('👋🏽', findEmoji('👋'));
  });

  it('marks the pressed category tab as active', async () => {
    await render(<EmojiPicker testID="emoji" onSelect={jest.fn()} />);
    await layoutGrid();
    const food = screen.getByRole('tab', { name: 'Food & Drink' });
    expect(food.props.accessibilityState).toMatchObject({ selected: false });
    await fireEvent.press(food);
    expect(screen.getByRole('tab', { name: 'Food & Drink' }).props.accessibilityState).toMatchObject({ selected: true });
  });
});

describe('EmojiPicker designs', () => {
  it('puts the categories at the bottom on iOS and Material, like their emoji keyboards, and on top on the web', async () => {
    await renderDesign('ios');
    expect(barIsBelowGrid()).toBe(true);
    await renderDesign('material');
    expect(barIsBelowGrid()).toBe(true);
    await renderDesign('web');
    expect(barIsBelowGrid()).toBe(false);
  });

  it('lets categoryBarPosition override the design', async () => {
    await render(<EmojiPicker testID="emoji" onSelect={jest.fn()} design="ios" categoryBarPosition="top" />);
    await layoutGrid();
    expect(barIsBelowGrid()).toBe(false);
  });

  it('marks the current category with a gray fill on iOS and a tinted pill in Material', async () => {
    const background = () => StyleSheet.flatten(screen.getByRole('tab', { selected: true }).props.style).backgroundColor;
    await renderDesign('ios');
    expect(background()).toBe(lightTheme.colors.surface);
    await renderDesign('material');
    expect(background()).toBe(lightTheme.colors.primaryMuted);
  });

  it('writes section titles in capitals on iOS only', async () => {
    const transform = () => StyleSheet.flatten(screen.getByText('Smileys & Emotion').props.style).textTransform;
    await renderDesign('ios');
    expect(transform()).toBe('uppercase');
    await renderDesign('web');
    expect(transform()).toBeUndefined();
  });
});

describe('EmojiPickerSheet', () => {
  it('closes after picking by default', async () => {
    const onSelect = jest.fn();
    const onClose = jest.fn();
    await render(<EmojiPickerSheet visible onClose={onClose} onSelect={onSelect} testID="emoji" />);
    await layoutGrid();
    await fireEvent.press(screen.getByLabelText('grinning face'));
    expect(onSelect).toHaveBeenCalledWith('😀', findEmoji('😀'));
    expect(onClose).toHaveBeenCalled();
  });
});
