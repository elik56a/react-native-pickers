import { fireEvent, render, screen } from '@testing-library/react-native';

import { EmojiPicker } from './EmojiPicker';
import { EmojiPickerSheet } from './EmojiPickerSheet';
import { findEmoji } from './emojis';

const layoutGrid = () =>
  fireEvent(screen.getByTestId('emoji-grid'), 'layout', {
    nativeEvent: { layout: { width: 320, height: 300 } },
  });

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
