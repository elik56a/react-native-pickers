import { ScrollView, StyleSheet, Text } from 'react-native';

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

  it('checks the chosen segment in Material, with no sliding thumb', async () => {
    await render(<HorizontalList items={items} value="range" onChange={jest.fn()} design="material" />);
    expect(screen.getAllByText('✓')).toHaveLength(1);
    await render(<HorizontalList items={items} value="range" onChange={jest.fn()} design="ios" />);
    expect(screen.queryByText('✓')).toBeNull();
  });

  it('puts the icon on the chosen side of the label', async () => {
    const withIcon = [{ label: 'Day', value: 'day', icon: <Text>☀</Text> }];
    const direction = () => StyleSheet.flatten(screen.getByLabelText('Day').props.style).flexDirection;
    await render(<HorizontalList items={withIcon} />);
    expect(direction()).toBe('row');
    await render(<HorizontalList items={withIcon} iconPosition="right" />);
    expect(direction()).toBe('row-reverse');
    await render(<HorizontalList items={withIcon} iconPosition="top" />);
    expect(direction()).toBe('column');
    await render(<HorizontalList items={withIcon} iconPosition="bottom" />);
    expect(direction()).toBe('column-reverse');
  });

  it("colors an icon function like its item's label", async () => {
    const icon = jest.fn(({ selected }: { selected: boolean }) => <Text>{selected ? 'on' : 'off'}</Text>);
    await render(
      <HorizontalList
        items={[
          { label: 'Day', value: 'day', icon },
          { label: 'Week', value: 'week', icon },
        ]}
        value="week"
        design="ios"
      />
    );
    expect(screen.getByText('on')).toBeTruthy();
    expect(screen.getByText('off')).toBeTruthy();
    expect(icon).toHaveBeenCalledWith(expect.objectContaining({ selected: true, disabled: false, color: expect.any(String) }));
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

  const measure = async () => {
    await fireEvent(screen.getByTestId('list'), 'layout', layout(0, 200));
    await fireEvent(screen.getByTestId('list'), 'contentSizeChange', 432, 34);
  };
  const isDisabled = (label: string) => screen.getByLabelText(label).props.accessibilityState.disabled;

  it('shows arrows only when asked, beside the list, dimming the one that cannot scroll further', async () => {
    const scrollTo = jest.spyOn(ScrollView.prototype, 'scrollTo').mockImplementation(() => {});
    await render(<HorizontalList items={items} testID="list" />);
    await measure();
    expect(screen.queryByLabelText('Scroll right')).toBeNull();

    await render(<HorizontalList items={items} testID="list" showArrows />);
    await measure();
    expect(isDisabled('Scroll left')).toBe(true);
    await fireEvent.press(screen.getByLabelText('Scroll right'));
    expect(scrollTo).toHaveBeenCalledWith({
      x: 184,
      animated: true,
    });
    expect(isDisabled('Scroll left')).toBe(false);
    await fireEvent.press(screen.getByLabelText('Scroll right'));
    expect(isDisabled('Scroll right')).toBe(true);
    scrollTo.mockRestore();
  });

  it('overlays the arrows on the edges, each only while items hide past it', async () => {
    const scrollTo = jest.spyOn(ScrollView.prototype, 'scrollTo').mockImplementation(() => {});
    await render(<HorizontalList items={items} testID="list" showArrows arrowPosition="overlay" />);
    await measure();
    expect(screen.queryByLabelText('Scroll left')).toBeNull();
    await fireEvent.press(screen.getByLabelText('Scroll right'));
    expect(scrollTo).toHaveBeenCalledWith({
      x: 144,
      animated: true,
    });
    expect(screen.getByLabelText('Scroll left')).toBeTruthy();
    await fireEvent.press(screen.getByLabelText('Scroll right'));
    expect(screen.queryByLabelText('Scroll right')).toBeNull();
    scrollTo.mockRestore();
  });

  it('renders custom arrows', async () => {
    await render(
      <HorizontalList items={items} testID="list" showArrows renderArrow={(side, disabled) => <Text>{`${side}:${disabled}`}</Text>} />
    );
    await measure();
    expect(screen.getByText('left:true')).toBeTruthy();
    expect(screen.getByText('right:false')).toBeTruthy();
  });
});
