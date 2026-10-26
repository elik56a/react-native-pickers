import { SHEET_PRESENTATION } from '../sheet/sheet.constants';
/** Lists with more options than this get a search field unless `searchable` says otherwise. */
export const SEARCH_THRESHOLD = 8;

export const SELECT_PRESENTATION = {
  ...SHEET_PRESENTATION,
  dropdown: 'dropdown',
} as const;

export const SELECT_ROW_TYPE = {
  header: 'header',
  option: 'option',
} as const;

export const DEFAULT_SEARCH_PLACEHOLDER = 'Search';
export const DEFAULT_EMPTY_TEXT = 'No results';

export const DISABLED_OPTION_OPACITY = 0.45;

export const CHECK_MARK = '✓';
