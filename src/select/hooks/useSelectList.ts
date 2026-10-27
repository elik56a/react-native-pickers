import { useCallback, useMemo, useRef, useState } from 'react';

import { DEFAULT_SEARCH_DEBOUNCE_MS, NO_OPTIONS } from '../select.constants';
import type { SelectListProps, SelectOption } from '../select.types';
import { buildRows, findOptions, isAtMax, toggleValue, toValueList } from '../select.utils';
import { useRemoteSearch } from './useRemoteSearch';

/** Search query, visible rows and selection toggling for a SelectList. */
export const useSelectList = <T>(
  props: SelectListProps<T>,
  filterOption: (option: SelectOption<T>, query: string) => boolean,
  isEqual: (a: T, b: T) => boolean
) => {
  const [ownQuery, setQuery] = useState('');
  const query = props.query ?? ownQuery;
  const search = useRemoteSearch({
    query,
    options: props.options ?? NO_OPTIONS,
    loadOptions: props.loadOptions,
    onSearchChange: props.onSearchChange,
    debounce: props.searchDebounce ?? DEFAULT_SEARCH_DEBOUNCE_MS,
  });
  const { options } = search;
  const values = toValueList(props.multiple, props.value);
  const maxSelected = props.multiple ? props.maxSelected : undefined;
  const atMax = !!props.multiple && isAtMax(values.length, maxSelected);
  // Search results come and go, so the selected options are kept to report them all in a multiple onChange.
  const selectedOptions = useRef<SelectOption<T>[]>([]);
  selectedOptions.current = findOptions(values, [...options, ...selectedOptions.current], isEqual);

  const rows = useMemo(
    () => (search.pending ? [] : buildRows(options, query, filterOption)),
    [filterOption, options, query, search.pending]
  );

  const isSelected = useCallback((value: T) => values.some((v) => isEqual(v, value)), [isEqual, values]);

  const toggle = useCallback(
    (option: SelectOption<T>) => {
      if (!props.multiple) {
        props.onChange?.(option.value, option);
        return;
      }
      const next = toggleValue(values, option.value, isEqual, maxSelected);
      if (next) props.onChange?.(next, findOptions(next, [...options, ...selectedOptions.current], isEqual));
    },
    [isEqual, maxSelected, options, props, values]
  );

  return {
    query,
    setQuery,
    rows,
    pending: search.pending,
    atMax,
    isSelected,
    toggle,
  };
};
