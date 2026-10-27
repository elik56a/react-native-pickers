import { useEffect, useRef, useState } from 'react';

import type { SelectOption } from '../select.types';

interface RemoteSearchOptions<T> {
  query: string;
  options: ReadonlyArray<SelectOption<T>>;
  loadOptions?: (query: string) => Promise<ReadonlyArray<SelectOption<T>>>;
  onSearchChange?: (query: string) => void;
  /** ms after the last keystroke before searching */
  debounce: number;
}

/**
 * Searches as the user types, once typing pauses: calls `onSearchChange`, and `loadOptions` for a non-empty query.
 * `pending` is true from the keystroke until the results arrive (or, without `loadOptions`, until `onSearchChange` is called).
 * Answers to an older query are dropped; an empty query shows `options` again.
 */
export const useRemoteSearch = <T>({ query, options, loadOptions, onSearchChange, debounce }: RemoteSearchOptions<T>) => {
  const [results, setResults] = useState<ReadonlyArray<SelectOption<T>>>([]);
  const [pending, setPending] = useState(false);
  const callbacks = useRef({ loadOptions, onSearchChange });
  callbacks.current = { loadOptions, onSearchChange };
  const sent = useRef('');
  const remote = !!(loadOptions || onSearchChange);

  useEffect(() => {
    if (!remote) return;
    if (query === sent.current) {
      setPending(false);
      return;
    }
    let current = true;
    setPending(!!query);
    const timer = setTimeout(
      () => {
        sent.current = query;
        const { loadOptions: load, onSearchChange: notify } = callbacks.current;
        notify?.(query);
        if (!load || !query) {
          setPending(false);
          return;
        }
        load(query).then(
          (loaded) => {
            if (!current) return;
            setResults(loaded);
            setPending(false);
          },
          () => {
            if (!current) return;
            setResults([]);
            setPending(false);
          }
        );
      },
      query ? debounce : 0
    );
    return () => {
      current = false;
      clearTimeout(timer);
    };
  }, [query, debounce, remote]);

  // The list unmounts with its sheet or dropdown, emptying the search; tell a remote list so it drops the old results.
  useEffect(
    () => () => {
      if (sent.current) callbacks.current.onSearchChange?.('');
    },
    []
  );

  return {
    options: loadOptions && query ? results : options,
    pending,
  };
};
