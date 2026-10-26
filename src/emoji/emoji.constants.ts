import type { EmojiCategory, EmojiSectionKey, EmojiTabKey } from './emoji.types';

export const EMOJI_CATEGORY = {
  smileys: 'smileys',
  people: 'people',
  animals: 'animals',
  food: 'food',
  travel: 'travel',
  activities: 'activities',
  objects: 'objects',
  symbols: 'symbols',
  flags: 'flags',
} as const;

/** Sections that aren't categories: recently used, and search results while searching. */
export const EMOJI_SECTION = {
  recent: 'recent',
  search: 'search',
} as const;

export const CATEGORY_BAR_POSITION = {
  top: 'top',
  bottom: 'bottom',
} as const;

export const EMOJI_ROW_TYPE = {
  header: 'header',
  emojis: 'emojis',
} as const;

export const EMOJI_CATEGORIES: EmojiCategory[] = Object.values(EMOJI_CATEGORY);

export const DEFAULT_CATEGORY_LABELS: Record<EmojiSectionKey, string> = {
  recent: 'Recently used',
  search: 'Search results',
  smileys: 'Smileys & Emotion',
  people: 'People & Body',
  animals: 'Animals & Nature',
  food: 'Food & Drink',
  travel: 'Travel & Places',
  activities: 'Activities',
  objects: 'Objects',
  symbols: 'Symbols',
  flags: 'Flags',
};

export const DEFAULT_CATEGORY_ICONS: Record<EmojiTabKey, string> = {
  recent: '🕘',
  smileys: '😀',
  people: '👋',
  animals: '🐻',
  food: '🍔',
  travel: '✈️',
  activities: '⚽',
  objects: '💡',
  symbols: '❤️',
  flags: '🏳️',
};

/** Emojibase group number → category. Group 2 (components: skin tones, hair) is not shipped. */
export const GROUP_TO_CATEGORY: Record<string, EmojiCategory> = {
  '0': EMOJI_CATEGORY.smileys,
  '1': EMOJI_CATEGORY.people,
  '3': EMOJI_CATEGORY.animals,
  '4': EMOJI_CATEGORY.food,
  '5': EMOJI_CATEGORY.travel,
  '6': EMOJI_CATEGORY.activities,
  '7': EMOJI_CATEGORY.objects,
  '8': EMOJI_CATEGORY.symbols,
  '9': EMOJI_CATEGORY.flags,
};

/** Index = skin tone. */
export const TONE_SWATCHES = ['✋', '✋🏻', '✋🏼', '✋🏽', '✋🏾', '✋🏿'];

export const DEFAULT_COLUMNS = 8;
export const DEFAULT_HEIGHT = 380;
export const DEFAULT_SHEET_HEIGHT = 420;
export const DEFAULT_MAX_RECENT = 24;
export const DEFAULT_SEARCH_PLACEHOLDER = 'Search emoji';
export const DEFAULT_EMPTY_TEXT = 'No emoji found';

export const SECTION_HEADER_HEIGHT = 32;
/** Cell size before the grid has been measured. */
export const FALLBACK_CELL_SIZE = 40;
export const EMOJI_TO_CELL_RATIO = 0.62;
/** Extra rows rendered beyond the first screen. */
export const INITIAL_ROW_BUFFER = 2;

/** Scroll events are ignored this long after a category jump, so the bar doesn't flicker through the sections it scrolls past. */
export const JUMP_LOCK_MS = 450;
/** Probe a few points below the top edge so a section counts as active once its header reaches the top. */
export const SCROLL_PROBE_OFFSET = 4;

export const INACTIVE_TAB_OPACITY = 0.45;
