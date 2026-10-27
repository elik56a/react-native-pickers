import { ScrollView } from 'react-native';

import { fireEvent, render, screen } from '@testing-library/react-native';

import { HorizontalList } from './HorizontalList';
import type { HorizontalListItem } from './list.types';

const items: HorizontalListItem<string>[] = ['Single', 'Range', 'Multiple', 'Ranges'].map((label) => ({
  label,
  value: label.toLowerCase(),
}));

const layout = (x: number, width: number) => ({ nativeEvent: { layout: { x, y: 0, width, height: 34 } } });

describe('HorizontalList', () => {
  it('marks the selected item and reports presses', async () => {
    const onChange = jest.fn();
    await render(<HorizontalList items={items} value="range" onChange={onChange} />);
    expect(screen.getByLabelText('Range').props.accessibilityState).toMatchObject({ checked: true });
    await fireEvent.press(screen.getByLabelText('Multiple'));
    expect(onChange).toHaveBeenCalledWith('multiple', items[2]);
  });

  it('ignores disabled items', async () => {
    const onChange = jest.fn();
    await render(<HorizontalList items={[{ label: 'Single', value: 'single', disabled: true }]} onChange={onChange} />);
    await fireEvent.press(screen.getByLabelText('Single'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('scrolls the next item into view when the last visible one is pressed', async () => {
    const scrollTo = jest.spyOn(ScrollView.prototype, 'scrollTo').mockImplementation(() => {});
    await render(<HorizontalList items={items} testID="list" />);
    const list = screen.getByTestId('list');
    await fireEvent(list, 'layout', layout(0, 200));
    await fireEvent(list, 'contentSizeChange', 432, 34);
    for (const i of items.keys()) {
      await fireEvent(screen.getByTestId(`list-item-${i}`), 'layout', layout(i * 88, 80));
    }
    await fireEvent.press(screen.getByLabelText('Range'));
    expect(scrollTo).toHaveBeenCalledWith({
      x: 72,
      animated: true,
    });
    scrollTo.mockRestore();
  });
});
