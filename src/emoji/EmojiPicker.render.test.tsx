import { useState } from 'react';

import { fireEvent, render, screen } from '@testing-library/react-native';

import { EmojiPicker } from './EmojiPicker';
import { DEFAULT_COLUMNS } from './emoji.constants';
import type { EmojiCellProps } from './emoji.types';

const mockCells = { renders: 0, mounts: 0 };

// Counts every emoji cell render and mount, keeping the real cell and its memo.
jest.mock('./components/EmojiCell', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { EmojiCell } = jest.requireActual<typeof import('./components/EmojiCell')>('./components/EmojiCell');
  const Cell = (EmojiCell as unknown as { type: React.ComponentType<EmojiCellProps> }).type;
  const Counted = (props: EmojiCellProps) => {
    mockCells.renders++;
    React.useEffect(() => {
      mockCells.mounts++;
    }, []);
    return React.createElement(Cell, props);
  };
  return { EmojiCell: React.memo(Counted) };
});

/** A parent that re-renders on every pick with a new onSelect, as a field updating its value does. */
const Composer = () => {
  const [text, setText] = useState('');
  return <EmojiPicker testID="emoji" onSelect={(char) => setText(text + char)} />;
};

const pick = async (name: string) => {
  mockCells.renders = 0;
  mockCells.mounts = 0;
  await fireEvent.press(screen.getByLabelText(name));
};

describe('EmojiPicker rendering', () => {
  it('redraws only the recent row when an emoji is picked, not the whole grid', async () => {
    await render(<Composer />);
    await fireEvent(screen.getByTestId('emoji-grid'), 'layout', { nativeEvent: { layout: { width: 320, height: 300 } } });

    await pick('grinning face');
    expect(mockCells.mounts).toBeLessThanOrEqual(DEFAULT_COLUMNS);
    expect(mockCells.renders).toBeLessThanOrEqual(DEFAULT_COLUMNS);

    await pick('grinning squinting face');
    expect(mockCells.renders).toBeLessThanOrEqual(DEFAULT_COLUMNS);
  });
});
