import { fireEvent, render, screen } from '@testing-library/react-native';

import { SelectList } from './SelectList';
import type { SelectOption } from './select.types';

const countries: SelectOption<string>[] = [
  { label: 'Israel', value: 'IL', group: 'Middle East', keywords: ['ישראל'] },
  { label: 'Jordan', value: 'JO', group: 'Middle East' },
  { label: 'France', value: 'FR', group: 'Europe', description: 'République française' },
  { label: 'Spain', value: 'ES', group: 'Europe', disabled: true },
];
const tags: SelectOption<string>[] = ['React', 'TypeScript', 'Expo'].map((label) => ({
  label,
  value: label.toLowerCase(),
}));

describe('SelectList', () => {
  it('renders group headers and descriptions', async () => {
    await render(<SelectList options={countries} />);
    expect(screen.getByText('Middle East')).toBeTruthy();
    expect(screen.getByText('République française')).toBeTruthy();
  });

  it('selects one option', async () => {
    const onChange = jest.fn();
    await render(<SelectList options={countries} value="IL" onChange={onChange} />);
    expect(screen.getByLabelText('Israel').props.accessibilityState).toMatchObject({ selected: true });
    await fireEvent.press(screen.getByLabelText('France'));
    expect(onChange).toHaveBeenCalledWith('FR', countries[2]);
  });

  it('ignores disabled options', async () => {
    const onChange = jest.fn();
    await render(<SelectList options={countries} onChange={onChange} />);
    await fireEvent.press(screen.getByLabelText('Spain'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('toggles values in multiple mode', async () => {
    const onChange = jest.fn();
    await render(<SelectList multiple options={tags} value={['react']} onChange={onChange} />);
    await fireEvent.press(screen.getByLabelText('Expo'));
    expect(onChange).toHaveBeenLastCalledWith(['react', 'expo'], [tags[0], tags[2]]);
    await fireEvent.press(screen.getByLabelText('React'));
    expect(onChange).toHaveBeenLastCalledWith([], []);
  });

  it('disables unselected options at maxSelected', async () => {
    const onChange = jest.fn();
    await render(<SelectList multiple maxSelected={1} options={tags} value={['react']} onChange={onChange} />);
    expect(screen.getByLabelText('Expo').props.accessibilityState).toMatchObject({ disabled: true });
    await fireEvent.press(screen.getByLabelText('Expo'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('filters by search and shows the empty text', async () => {
    await render(<SelectList options={countries} searchable emptyText="Nothing here" />);
    await fireEvent.changeText(screen.getByLabelText('Search'), 'ישראל');
    expect(screen.getByText('Israel')).toBeTruthy();
    expect(screen.queryByText('France')).toBeNull();
    await fireEvent.changeText(screen.getByLabelText('Search'), 'zzz');
    expect(screen.getByText('Nothing here')).toBeTruthy();
  });

  it('only shows search by default for long lists', async () => {
    await render(<SelectList options={tags} />);
    expect(screen.queryByLabelText('Search')).toBeNull();
  });
});
