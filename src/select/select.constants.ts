import { FIELD_PRESENTATION } from '../sheet/sheet.constants';

/** Lists with more options than this get a search field unless `searchable` says otherwise. */
export const SEARCH_THRESHOLD = 8;

export const SELECT_PRESENTATION = FIELD_PRESENTATION;

export const SELECT_ROW_TYPE = {
  header: 'header',
  option: 'option',
} as const;

/** One empty list for a missing `options`, so memos that depend on it don't rerun every render. */
export const NO_OPTIONS: ReadonlyArray<never> = [];

export const DEFAULT_SEARCH_PLACEHOLDER = 'Search';
export const DEFAULT_EMPTY_TEXT = 'No results';
export const DEFAULT_LOADING_TEXT = 'Loading…';
export const DEFAULT_SEARCH_PROMPT = 'Type to search';
/** Wait for a pause in typing before searching a server. */
export const DEFAULT_SEARCH_DEBOUNCE_MS = 300;

export const DISABLED_OPTION_OPACITY = 0.45;

export const CHECK_MARK = '✓';
