import { SEARCH_THRESHOLD } from './select.constants';
import type { SelectOption, SelectPresentation, SelectRow } from './select.types';

/** Lowercase and strip Latin diacritics and Hebrew niqqud. */
const fold = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-֑ͯ-ׇ]/g, '');

/** Every word of the query must appear in the label, description or keywords. */
export const defaultFilter = <T>(option: SelectOption<T>, query: string): boolean => {
  const haystack = fold([option.label, option.description ?? '', ...(option.keywords ?? [])].join(' '));
  return fold(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
};

export const shouldShowSearch = (searchable: boolean | undefined, optionCount: number) => searchable ?? optionCount > SEARCH_THRESHOLD;

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
    ...(group ? [{ type: 'header' as const, group }] : []),
    ...members.map((option) => ({
      type: 'option' as const,
      option,
    })),
  ]);
};

export const getRowKey = <T>(row: SelectRow<T>, index: number) =>
  row.type === 'header' ? `h:${row.group}` : `o:${index}:${row.option.label}`;

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

/** `auto` is a dropdown on the web, where options are expected under the field, and a bottom sheet on native. */
export const resolveSelectPresentation = (presentation: SelectPresentation, platform: string): SelectPresentation =>
  presentation === 'auto' && platform === 'web' ? 'dropdown' : presentation;
