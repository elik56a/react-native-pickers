import { act, renderHook } from '@testing-library/react-native';

import type { SelectOption } from '../select.types';
import { useRemoteSearch } from './useRemoteSearch';

const OPTIONS: SelectOption<string>[] = [{ label: 'Default', value: 'default' }];
const found = (query: string): SelectOption<string>[] => [{ label: `${query} result`, value: query }];

type Props = Parameters<typeof useRemoteSearch<string>>[0];

const setup = (props: Partial<Props>) =>
  renderHook((p: Props) => useRemoteSearch(p), {
    initialProps: {
      query: '',
      options: OPTIONS,
      debounce: 300,
      ...props,
    },
  });

const wait = async (ms: number) => act(() => jest.advanceTimersByTime(ms));

describe('useRemoteSearch', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('passes the options through and searches nothing without loadOptions or onSearchChange', async () => {
    const { result, rerender } = await setup({});
    await rerender({ query: 'par', options: OPTIONS, debounce: 300 });
    await wait(300);
    expect(result.current).toEqual({
      options: OPTIONS,
      pending: false,
    });
  });

  it('does not search the empty query it starts with', async () => {
    const loadOptions = jest.fn();
    const onSearchChange = jest.fn();
    const { result } = await setup({ loadOptions, onSearchChange });
    await wait(300);
    expect(loadOptions).not.toHaveBeenCalled();
    expect(onSearchChange).not.toHaveBeenCalled();
    expect(result.current.options).toBe(OPTIONS);
  });

  it('is pending from the keystroke, loads once typing pauses, then shows the results', async () => {
    const loadOptions = jest.fn((query: string) => Promise.resolve(found(query)));
    const { result, rerender } = await setup({ loadOptions });
    await rerender({ query: 'pa', options: OPTIONS, debounce: 300, loadOptions });
    expect(result.current.pending).toBe(true);
    await wait(200);
    await rerender({ query: 'par', options: OPTIONS, debounce: 300, loadOptions });
    await wait(299);
    expect(loadOptions).not.toHaveBeenCalled();
    await wait(1);
    expect(loadOptions).toHaveBeenCalledTimes(1);
    expect(loadOptions).toHaveBeenCalledWith('par');
    expect(result.current).toEqual({
      options: found('par'),
      pending: false,
    });
  });

  it('drops the answer to an older query', async () => {
    let answerOld: (options: SelectOption<string>[]) => void = () => {};
    const loadOptions = jest.fn((query: string) =>
      query === 'old' ? new Promise<SelectOption<string>[]>((resolve) => (answerOld = resolve)) : Promise.resolve(found(query))
    );
    const { result, rerender } = await setup({ loadOptions, debounce: 0 });
    await rerender({ query: 'old', options: OPTIONS, debounce: 0, loadOptions });
    await wait(0);
    await rerender({ query: 'new', options: OPTIONS, debounce: 0, loadOptions });
    await wait(0);
    await act(async () => answerOld(found('old')));
    expect(result.current.options).toEqual(found('new'));
  });

  it('goes back to the options when the query is cleared, without loading', async () => {
    const loadOptions = jest.fn((query: string) => Promise.resolve(found(query)));
    const { result, rerender } = await setup({ loadOptions });
    await rerender({ query: 'par', options: OPTIONS, debounce: 300, loadOptions });
    await wait(300);
    await rerender({ query: '', options: OPTIONS, debounce: 300, loadOptions });
    await wait(0);
    expect(result.current).toEqual({
      options: OPTIONS,
      pending: false,
    });
    expect(loadOptions).toHaveBeenCalledTimes(1);
  });

  it('stops pending when the query is typed back to the last one searched', async () => {
    const loadOptions = jest.fn((query: string) => Promise.resolve(found(query)));
    const { result, rerender } = await setup({ loadOptions });
    await rerender({ query: 'p', options: OPTIONS, debounce: 300, loadOptions });
    expect(result.current.pending).toBe(true);
    await rerender({ query: '', options: OPTIONS, debounce: 300, loadOptions });
    expect(result.current.pending).toBe(false);
    expect(loadOptions).not.toHaveBeenCalled();
  });

  it('shows no results when loading fails', async () => {
    const loadOptions = jest.fn(() => Promise.reject(new Error('offline')));
    const { result, rerender } = await setup({ loadOptions, debounce: 0 });
    await rerender({ query: 'par', options: OPTIONS, debounce: 0, loadOptions });
    await wait(0);
    expect(result.current).toEqual({
      options: [],
      pending: false,
    });
  });

  it('is pending only until onSearchChange is called, without loadOptions', async () => {
    const onSearchChange = jest.fn();
    const { result, rerender } = await setup({ onSearchChange });
    await rerender({ query: 'par', options: OPTIONS, debounce: 300, onSearchChange });
    expect(result.current.pending).toBe(true);
    await wait(300);
    expect(onSearchChange).toHaveBeenCalledWith('par');
    expect(result.current).toEqual({
      options: OPTIONS,
      pending: false,
    });
  });

  it('calls onSearchChange with an empty query on unmount after a search, and only then', async () => {
    const onSearchChange = jest.fn();
    const searched = await setup({ onSearchChange });
    await searched.rerender({ query: 'par', options: OPTIONS, debounce: 0, onSearchChange });
    await wait(0);
    await searched.unmount();
    expect(onSearchChange).toHaveBeenLastCalledWith('');

    const untouched = jest.fn();
    const idle = await setup({ onSearchChange: untouched });
    await idle.unmount();
    expect(untouched).not.toHaveBeenCalled();
  });
});
