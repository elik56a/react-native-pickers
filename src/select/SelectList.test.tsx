import { StyleSheet, Text } from 'react-native';

import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { lightTheme } from '../core';
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

  it('marks single choices with radios in the Material design', async () => {
    await render(<SelectList options={tags} value="react" design="material" />);
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByRole('radio', { name: 'React' }).props.accessibilityState).toMatchObject({ checked: true });
    expect(screen.getByRole('radio', { name: 'Expo' }).props.accessibilityState).toMatchObject({ checked: false });
  });

  it('selects one option', async () => {
    const onChange = jest.fn();
    await render(<SelectList options={countries} value="IL" onChange={onChange} />);
    expect(screen.getByLabelText('Israel').props.accessibilityState).toMatchObject({ selected: true });
    await fireEvent.press(screen.getByLabelText('France'));
    expect(onChange).toHaveBeenCalledWith('FR', countries[2]);
  });

  describe('creating options', () => {
    const toTag = (text: string) => ({
      label: text,
      value: text.toLowerCase(),
    });
    const search = async (text: string) => fireEvent.changeText(screen.getByLabelText('Search'), text);
    const addRow = (text: string) => screen.getByRole('button', { name: `Add "${text}"` });

    it('offers the typed text as a new option and selects what onCreate returns', async () => {
      const onChange = jest.fn();
      const onCreate = jest.fn(toTag);
      await render(<SelectList options={tags} searchable multiple value={['react']} onChange={onChange} onCreate={onCreate} />);
      await search(' Vue ');
      await fireEvent.press(addRow('Vue'));
      expect(onCreate).toHaveBeenCalledWith('Vue');
      expect(onChange).toHaveBeenCalledWith(['react', 'vue'], [tags[0], { label: 'Vue', value: 'vue' }]);
      expect(screen.getByLabelText('Search').props.value).toBe('');
    });

    it('shows the row last, under the matching options, with a + and its label in the primary colour', async () => {
      await render(<SelectList options={tags} searchable onCreate={toTag} />);
      await search('Re');
      expect(screen.getAllByRole('button').map((row) => row.props.accessibilityLabel)).toEqual(['React', 'Add "Re"']);
      expect(StyleSheet.flatten(screen.getByText('+').props.style).color).toBe(lightTheme.colors.primary);
      expect(StyleSheet.flatten(screen.getByText('Add "Re"').props.style).color).toBe(lightTheme.colors.primary);
    });

    it('selects the new option in single mode', async () => {
      const onChange = jest.fn();
      await render(<SelectList options={tags} searchable onChange={onChange} onCreate={toTag} />);
      await search('Vue');
      await fireEvent.press(addRow('Vue'));
      expect(onChange).toHaveBeenCalledWith('vue', { label: 'Vue', value: 'vue' });
    });

    it('selects nothing when onCreate returns nothing, and still clears the search', async () => {
      const onChange = jest.fn();
      const onCreate = jest.fn();
      await render(<SelectList options={tags} searchable onChange={onChange} onCreate={onCreate} />);
      await search('Vue');
      await fireEvent.press(addRow('Vue'));
      expect(onCreate).toHaveBeenCalledWith('Vue');
      expect(onChange).not.toHaveBeenCalled();
      expect(screen.getByLabelText('Search').props.value).toBe('');
    });

    it('offers no new option for a label that exists, past maxSelected, or with a custom label', async () => {
      const onCreate = jest.fn();
      const { rerender } = await render(<SelectList options={tags} searchable onCreate={onCreate} />);
      await search('expo');
      expect(screen.queryByText(/^Add/)).toBeNull();
      await rerender(<SelectList options={tags} searchable multiple value={['react']} maxSelected={1} onCreate={onCreate} />);
      await search('Vue');
      expect(screen.queryByText(/^Add/)).toBeNull();
      await rerender(<SelectList options={tags} searchable onCreate={onCreate} createLabel={(text) => `New tag: ${text}`} />);
      await search('Vue');
      expect(screen.getByText('New tag: Vue')).toBeTruthy();
      expect(screen.queryByText('No results')).toBeNull();
    });

    it('styles the row with the createOption and createOptionLabel slots', async () => {
      await render(
        <SelectList
          options={tags}
          searchable
          onCreate={toTag}
          styles={{ createOption: { paddingVertical: 20 }, createOptionLabel: { fontStyle: 'italic' } }}
        />
      );
      await search('Vue');
      expect(StyleSheet.flatten(addRow('Vue').props.style)).toMatchObject({ paddingVertical: 20 });
      expect(StyleSheet.flatten(screen.getByText('Add "Vue"').props.style)).toMatchObject({ fontStyle: 'italic' });
    });
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

  describe('loading', () => {
    it('shows the loader in place of the empty text, with a custom label', async () => {
      await render(<SelectList options={[]} loading loadingText="Fetching cities" />);
      expect(screen.getByText('Fetching cities')).toBeTruthy();
      expect(screen.queryByText('No results')).toBeNull();
    });

    it('shows the loader under the options while more load', async () => {
      await render(<SelectList options={tags} loading />);
      expect(screen.getByLabelText('Expo')).toBeTruthy();
      expect(screen.getByText('Loading…')).toBeTruthy();
    });

    it('renders a custom loader', async () => {
      await render(<SelectList options={[]} loading renderLoading={() => <Text>Hold on</Text>} />);
      expect(screen.getByText('Hold on')).toBeTruthy();
      expect(screen.queryByText('Loading…')).toBeNull();
    });
  });

  describe('remote search', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    const type = async (text: string) => fireEvent.changeText(screen.getByLabelText('Search'), text);
    const wait = async (ms: number) => act(() => jest.advanceTimersByTime(ms));

    it('shows search before any options arrive, and reports the query once typing pauses', async () => {
      const onSearchChange = jest.fn();
      await render(<SelectList options={[]} onSearchChange={onSearchChange} />);
      await type('pa');
      await type('par');
      await wait(299);
      expect(onSearchChange).not.toHaveBeenCalled();
      await wait(1);
      expect(onSearchChange).toHaveBeenCalledTimes(1);
      expect(onSearchChange).toHaveBeenCalledWith('par');
    });

    it('lists the options as given, since the server already filtered them', async () => {
      await render(<SelectList options={tags} onSearchChange={jest.fn()} searchDebounce={0} />);
      await type('zzz');
      await wait(0);
      expect(screen.getByLabelText('Expo')).toBeTruthy();
    });

    it('resets the query when the list unmounts after a search', async () => {
      const onSearchChange = jest.fn();
      const { unmount } = await render(<SelectList options={[]} onSearchChange={onSearchChange} />);
      await type('par');
      await wait(300);
      await unmount();
      expect(onSearchChange).toHaveBeenLastCalledWith('');
    });

    describe('loadOptions', () => {
      const cities = (query: string) => [{ label: `${query} City`, value: query }];

      it('shows the loader from the keystroke until the results arrive, then lists them', async () => {
        const loadOptions = jest.fn((query: string) => Promise.resolve(cities(query)));
        await render(<SelectList options={tags} loadOptions={loadOptions} />);
        expect(screen.getByLabelText('Expo')).toBeTruthy();
        await type('par');
        expect(screen.getByText('Loading…')).toBeTruthy();
        expect(screen.queryByLabelText('Expo')).toBeNull();
        await wait(300);
        expect(loadOptions).toHaveBeenCalledWith('par');
        expect(screen.getByLabelText('par City')).toBeTruthy();
        expect(screen.queryByText('Loading…')).toBeNull();
      });

      it('offers a new option only once the results arrive, and only if none has that label', async () => {
        const loadOptions = jest.fn((query: string) =>
          Promise.resolve(query === 'paris' ? [{ label: 'Paris', value: 'paris' }] : cities(query))
        );
        await render(<SelectList options={tags} loadOptions={loadOptions} onCreate={jest.fn()} />);
        await type('lyon');
        expect(screen.queryByText(/^Add/)).toBeNull();
        await wait(300);
        expect(screen.getByText('Add "lyon"')).toBeTruthy();
        await type('paris');
        await wait(300);
        expect(screen.queryByText(/^Add/)).toBeNull();
      });

      it('ignores an answer to an older query', async () => {
        let answerOld: (options: SelectOption<string>[]) => void = () => {};
        const loadOptions = jest.fn((query: string) =>
          query === 'old' ? new Promise<SelectOption<string>[]>((resolve) => (answerOld = resolve)) : Promise.resolve(cities(query))
        );
        await render(<SelectList loadOptions={loadOptions} searchDebounce={0} />);
        await type('old');
        await wait(0);
        await type('new');
        await wait(0);
        await act(async () => answerOld(cities('old')));
        expect(screen.getByLabelText('new City')).toBeTruthy();
        expect(screen.queryByLabelText('old City')).toBeNull();
      });

      it('goes back to the options when the query is cleared', async () => {
        const loadOptions = jest.fn((query: string) => Promise.resolve(cities(query)));
        await render(<SelectList options={tags} loadOptions={loadOptions} />);
        await type('par');
        await wait(300);
        await type('');
        await wait(0);
        expect(screen.getByLabelText('Expo')).toBeTruthy();
        expect(loadOptions).toHaveBeenCalledTimes(1);
      });

      it('asks for a query before the user types, and says nothing matched after', async () => {
        await render(
          <SelectList loadOptions={() => Promise.resolve([])} searchPrompt="Type a city" emptyText="No city" searchDebounce={0} />
        );
        expect(screen.getByText('Type a city')).toBeTruthy();
        await type('zz');
        await wait(0);
        expect(screen.getByText('No city')).toBeTruthy();
        expect(screen.queryByText('Type a city')).toBeNull();
      });

      it('shows the empty text when the request fails', async () => {
        await render(<SelectList loadOptions={() => Promise.reject(new Error('offline'))} searchDebounce={0} />);
        await type('par');
        await wait(0);
        expect(screen.getByText('No results')).toBeTruthy();
      });
    });
  });
});
