import { SEARCH_THRESHOLD, SELECT_ROW_TYPE } from './select.constants';
import type { SelectOption, SelectPickerProps, SelectRow } from './select.types';

/** Lowercase and strip Latin diacritics and Hebrew niqqud. */
const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f\u0591-\u05c7]/g, '');

/** Every word of the query must appear in the label, description or keywords. */
export const defaultFilter = <T>(option: SelectOption<T>, query: string): boolean => {
  const haystack = fold([option.label, option.description ?? '', ...(option.keywords ?? [])].join(' '));
  return fold(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
};

/** Long lists get a search field, and so do lists searched remotely, which may have no options until the user types. */
export const shouldShowSearch = (searchable: boolean | undefined, optionCount: number, remote = false) =>
  searchable ?? (remote || optionCount > SEARCH_THRESHOLD);

/** A searched list with nothing typed and nothing to show asks for a query; anything else empty found no results. */
export const getEmptyMessage = (remote: boolean, query: string, prompt: string, emptyText: string) =>
  remote && !query ? prompt : emptyText;

/** A dropdown types into the field itself, unless search is off or `renderTrigger` replaced the field: then the list has its own search. */
export const shouldSearchInField = (dropdown: boolean, searchable: boolean | undefined, customTrigger: boolean) =>
  dropdown && searchable !== false && !customTrigger;

/** For options a server already filtered. */
export const keepAll = () => true;

/** The selected values as a list, whatever the mode. */
export const toValueList = <T>(multiple: boolean | undefined, value: T | T[] | null | undefined): T[] => {
  if (multiple) return (value as T[] | undefined) ?? [];
  return value === undefined || value === null ? [] : [value as T];
};

export const findOptions = <T>(values: T[], options: ReadonlyArray<SelectOption<T>>, isEqual: (a: T, b: T) => boolean) =>
  values.flatMap((v) => options.find((o) => isEqual(o.value, v)) ?? []);

/** Filtered options as list rows, grouped in order of first appearance; ungrouped options get no header. */
export const buildRows = <T>(
  options: ReadonlyArray<SelectOption<T>>,
  query: string,
  filter: (option: SelectOption<T>, query: string) => boolean
): SelectRow<T>[] => {
  const groups = new Map<string, SelectOption<T>[]>();
  for (const option of query ? options.filter((o) => filter(o, query)) : options) {
    const group = option.group ?? '';
    groups.set(group, [...(groups.get(group) ?? []), option]);
  }
  // Array.from, not spread: Babel's loose mode (e.g. Docusaurus) compiles `[...map]` to `[map]`.
  return Array.from(groups).flatMap(([group, members]) => [
    ...(group ? [{ type: SELECT_ROW_TYPE.header, group }] : []),
    ...members.map((option) => ({
      type: SELECT_ROW_TYPE.option,
      option,
    })),
  ]);
};

export const getRowKey = <T>(row: SelectRow<T>, index: number) =>
  row.type === SELECT_ROW_TYPE.header ? `h:${row.group}` : `o:${index}:${row.option.label}`;

/** Values after toggling `value`; null when adding would pass `maxSelected`. */
export const toggleValue = <T>(values: T[], value: T, isEqual: (a: T, b: T) => boolean, maxSelected?: number): T[] | null => {
  if (values.some((v) => isEqual(v, value))) return values.filter((v) => !isEqual(v, value));
  if (maxSelected !== undefined && values.length >= maxSelected) return null;
  return [...values, value];
};

export const isAtMax = (count: number, maxSelected?: number) => maxSelected !== undefined && count >= maxSelected;

/** At the maximum, unselected options are disabled so the user sees why nothing happens. */
export const isOptionDisabled = <T>(option: SelectOption<T>, selected: boolean, atMax: boolean) =>
  !!option.disabled || (atMax && !selected);

export const getSelectedLabel = <T>(selected: SelectOption<T>[]) => selected.map((o) => o.label).join(', ');

type SheetOptions = SelectPickerProps<unknown>['sheet'];

/** A long built-in list opens its sheet at a fixed `height`, so it doesn't jump as search narrows it; the app's own height wins. */
export const withSheetHeight = (sheet: SheetOptions, height: number): SheetOptions => ({
  ...sheet,
  sheetProps: {
    height,
    ...sheet?.sheetProps,
  },
});
