import { useCallback, useMemo, useRef, useState } from 'react';

import { DEFAULT_SEARCH_DEBOUNCE_MS, NO_OPTIONS, SELECT_ROW_TYPE } from '../select.constants';
import type { SelectListProps, SelectOption, SelectRow } from '../select.types';
import { buildRows, findOptions, getCreateText, isAtMax, toggleValue, toValueList } from '../select.utils';
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

  const creatable = !!props.onCreate && !atMax;
  const rows = useMemo((): SelectRow<T>[] => {
    if (search.pending) return [];
    const text = creatable ? getCreateText(query, options) : null;
    const optionRows = buildRows(options, query, filterOption);
    return text ? [...optionRows, { type: SELECT_ROW_TYPE.create, text }] : optionRows;
  }, [creatable, filterOption, options, query, search.pending]);

  const isSelected = useCallback((value: T) => values.some((v) => isEqual(v, value)), [isEqual, values]);

  const toggle = useCallback(
    (option: SelectOption<T>) => {
      if (!props.multiple) {
        props.onChange?.(option.value, option);
        return;
      }
      const next = toggleValue(values, option.value, isEqual, maxSelected);
      // The toggled option may be one just created, not in `options` yet.
      if (next) props.onChange?.(next, findOptions(next, [...options, ...selectedOptions.current, option], isEqual));
    },
    [isEqual, maxSelected, options, props, values]
  );

  const { onCreate } = props;
  const create = useCallback(
    (text: string) => {
      const option = onCreate?.(text);
      setQuery('');
      if (!option) return;
      selectedOptions.current = [...selectedOptions.current, option];
      toggle(option);
    },
    [onCreate, toggle]
  );

  return {
    query,
    setQuery,
    rows,
    pending: search.pending,
    atMax,
    isSelected,
    toggle,
    create,
  };
};
