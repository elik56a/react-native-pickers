import { fireEvent, render, screen } from '@testing-library/react-native';

import { EmojiPickerField } from './EmojiPickerField';

describe('EmojiPickerField', () => {
  it('shows the picked emoji and opens the sheet', async () => {
    const onOpen = jest.fn();
    await render(<EmojiPickerField label="Reaction" presentation="bottomSheet" value="🍕" onOpen={onOpen} onSelect={jest.fn()} />);
    expect(screen.getByText('🍕')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Reaction' }));
    expect(onOpen).toHaveBeenCalled();
    expect(screen.getByLabelText('Search emoji')).toBeTruthy();
  });
});
