import { useCallback, useMemo, useState } from 'react';

import type { SelectListProps, SelectOption } from '../select.types';
import { buildRows, findOptions, isAtMax, toggleValue, toValueList } from '../select.utils';

/** Search query, visible rows and selection toggling for a SelectList. */
export const useSelectList = <T>(
  props: SelectListProps<T>,
  filterOption: (option: SelectOption<T>, query: string) => boolean,
  isEqual: (a: T, b: T) => boolean
) => {
  const { options } = props;
  const [query, setQuery] = useState('');
  const values = toValueList(props.multiple, props.value);
  const maxSelected = props.multiple ? props.maxSelected : undefined;
  const atMax = !!props.multiple && isAtMax(values.length, maxSelected);

  const rows = useMemo(() => buildRows(options, query, filterOption), [filterOption, options, query]);

  const isSelected = useCallback((value: T) => values.some((v) => isEqual(v, value)), [isEqual, values]);

  const toggle = useCallback(
    (option: SelectOption<T>) => {
      if (!props.multiple) {
        props.onChange?.(option.value, option);
        return;
      }
      const next = toggleValue(values, option.value, isEqual, maxSelected);
      if (next) props.onChange?.(next, findOptions(next, options, isEqual));
    },
    [isEqual, maxSelected, options, props, values]
  );

  return {
    query,
    setQuery,
    rows,
    atMax,
    isSelected,
    toggle,
  };
};
