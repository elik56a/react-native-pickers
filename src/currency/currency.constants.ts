import type { Design, TextWeight } from '../core/theme/theme.types';
import type { CurrencyCode } from './data';

export const DEFAULT_CURRENCY: CurrencyCode = 'USD';
export const DEFAULT_CURRENCY_PLACEHOLDER = 'Select a currency';
export const DEFAULT_CURRENCY_SEARCH_PLACEHOLDER = 'Search currencies';
export const DEFAULT_ALL_CURRENCIES_LABEL = 'All currencies';
export const CURRENCY_BUTTON_LABEL = 'Currency';
export const DEFAULT_AMOUNT_LABEL = 'Amount';

export const AMOUNT_VARIANT = {
  field: 'field',
  large: 'large',
} as const;

export const SYMBOL_POSITION = {
  before: 'before',
  after: 'after',
} as const;

/** Where `Intl` can't tell, as on engines without `formatToParts`. */
export const DEFAULT_SEPARATORS = {
  group: ',',
  decimal: '.',
};

/** More digits than this lose precision as a JavaScript number. */
export const MAX_INTEGER_DIGITS = 15;

/** The large amount's font size, until it holds more than `LARGE_AMOUNT_FIT_CHARS` characters; then it shrinks to fit. */
export const LARGE_AMOUNT_FONT_SIZE = 56;
export const MIN_LARGE_AMOUNT_FONT_SIZE = 28;
export const LARGE_AMOUNT_FIT_CHARS = 7;
/** The large amount's line height, as a multiple of its font size. */
export const LARGE_AMOUNT_LINE_HEIGHT = 1.2;

/** The large amount's weight: Apple Cash's bold digits, Google Pay's regular ones, and in between on the web. */
export const LARGE_AMOUNT_WEIGHT: Record<Design, TextWeight> = {
  ios: 'bold',
  material: 'regular',
  web: 'medium',
};
