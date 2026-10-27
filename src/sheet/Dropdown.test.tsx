import { Text } from 'react-native';

import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { Dropdown } from './Dropdown';

const anchor = {
  x: 16,
  y: 100,
  width: 300,
  height: 48,
};

describe('Dropdown', () => {
  it('renders nothing until the field is measured', async () => {
    const { rerender } = await render(
      <Dropdown visible anchor={null} onClose={jest.fn()}>
        <Text>Options</Text>
      </Dropdown>
    );
    expect(screen.queryByText('Options')).toBeNull();
    await rerender(
      <Dropdown visible anchor={anchor} onClose={jest.fn()}>
        <Text>Options</Text>
      </Dropdown>
    );
    expect(screen.getByText('Options')).toBeTruthy();
  });

  it('closes on a tap outside, and unmounts once hidden', async () => {
    const onClose = jest.fn();
    const { rerender } = await render(
      <Dropdown visible anchor={anchor} onClose={onClose}>
        <Text>Options</Text>
      </Dropdown>
    );
    await fireEvent.press(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
    await rerender(
      <Dropdown visible={false} anchor={anchor} onClose={onClose}>
        <Text>Options</Text>
      </Dropdown>
    );
    await waitFor(() => expect(screen.queryByText('Options')).toBeNull());
  });

  it('draws the overlay over the field', async () => {
    await render(
      <Dropdown visible anchor={anchor} onClose={jest.fn()} overlay={<Text>Search field</Text>}>
        <Text>Options</Text>
      </Dropdown>
    );
    expect(screen.getByText('Search field')).toBeTruthy();
  });
});
