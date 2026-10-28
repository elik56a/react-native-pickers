import type { Design } from '../core/theme/theme.types';
import { FIELD_PRESENTATION } from '../sheet/sheet.constants';
import type { SelectDesign } from './select.types';

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

/** A dropdown opened from a narrow trigger, such as a `renderTrigger` button, still fits a row's icon and label. */
export const SELECT_DROPDOWN_MIN_WIDTH = 240;

export const SINGLE_INDICATOR = {
  check: 'check',
  radio: 'radio',
} as const;

/** Material lists run edge to edge, untinted, with a radio or a small square checkbox showing the choice. */
export const SELECT_DESIGN: Record<Design, SelectDesign> = {
  ios: {
    singleIndicator: SINGLE_INDICATOR.check,
    insetRows: true,
    tintSelected: true,
    rowHeight: 48,
    checkbox: { size: 22, radius: 6, offColor: 'border' },
  },
  material: {
    singleIndicator: SINGLE_INDICATOR.radio,
    insetRows: false,
    tintSelected: false,
    rowHeight: 56,
    checkbox: { size: 18, radius: 2, offColor: 'textSecondary' },
  },
  web: {
    singleIndicator: SINGLE_INDICATOR.check,
    insetRows: true,
    tintSelected: true,
    rowHeight: 40,
    checkbox: { size: 18, radius: 4, offColor: 'textSecondary' },
  },
};
