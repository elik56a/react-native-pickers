import type { AnchorRect } from '../sheet/sheet.types';
import {
  EMOJI_ROW_TYPE,
  EMOJI_SECTION,
  EMOJI_TO_CELL_RATIO,
  FALLBACK_CELL_SIZE,
  INITIAL_ROW_BUFFER,
  SECTION_HEADER_HEIGHT,
  SKIN_TONES,
  TONE_POPOVER_GAP,
  TONE_POPOVER_PADDING,
} from './emoji.constants';
import type {
  Emoji,
  EmojiCategory,
  EmojiLayout,
  EmojiRow,
  EmojiSection,
  EmojiSectionKey,
  EmojiSectionsOptions,
  EmojiTabKey,
  RecentEmojis,
  SkinTone,
} from './emoji.types';
import { findEmoji, getAllEmojis } from './emojis';

export const withSkinTone = (e: Emoji, tone: SkinTone): string => (tone > 0 && e.skins ? (e.skins[tone - 1] ?? e.emoji) : e.emoji);

/**
 * Where a long-pressed emoji's skin tones open, inside the picker: centered over the emoji and kept within the picker's width,
 * above it like an emoji keyboard, or below when there's no room above.
 */
export const getTonePopoverPosition = (cell: AnchorRect, containerWidth: number, size: number) => {
  const width = SKIN_TONES.length * size + 2 * TONE_POPOVER_PADDING;
  const height = size + 2 * TONE_POPOVER_PADDING;
  const above = cell.y - height - TONE_POPOVER_GAP;
  return {
    left: Math.min(Math.max(0, cell.x + (cell.width - width) / 2), Math.max(0, containerWidth - width)),
    top: above >= 0 ? above : cell.y + cell.height + TONE_POPOVER_GAP,
  };
};

/** Name prefix beats word prefix beats keyword prefix beats substring; every term must match. */
const scoreTerm = (e: Emoji, term: string) => {
  if (e.name.startsWith(term)) return 3;
  if (e.name.includes(` ${term}`)) return 2;
  if (e.keywords.some((k) => k.startsWith(term))) return 1;
  if (e.name.includes(term)) return 0.5;
  return 0;
};

/** Sum of term scores, or 0 as soon as one term misses. */
const scoreEmoji = (e: Emoji, terms: string[]) => {
  let total = 0;
  for (const term of terms) {
    const score = scoreTerm(e, term);
    if (!score) return 0;
    total += score;
  }
  return total;
};

export const searchEmojis = (query: string, list: Emoji[] = getAllEmojis()): Emoji[] => {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const scored: { e: Emoji; score: number }[] = [];
  for (const e of list) {
    const score = scoreEmoji(e, terms);
    if (score) {
      scored.push({
        e,
        score,
      });
    }
  }
  return scored.sort((a, b) => b.score - a.score).map((x) => x.e);
};

/** The emojis the picker may show: in `categories`, not excluded, not newer than `maxEmojiVersion`. */
export const filterEmojis = (all: Emoji[], categories: EmojiCategory[], exclude?: string[], maxEmojiVersion?: number): Emoji[] => {
  // Resolved, so a variation selector or skin tone in `exclude` still matches.
  const excluded = new Set(exclude?.map(findEmoji));
  const shown = new Set(categories);
  return all.filter((e) => shown.has(e.category) && (maxEmojiVersion === undefined || e.version <= maxEmojiVersion) && !excluded.has(e));
};

/** Recent characters that resolve to an emoji in `pool`, in order. */
/** The recents the pool allows, with the characters as they were picked, skin tone included. */
export const resolveRecent = (recent: string[], pool: Emoji[]): RecentEmojis => {
  const allowed = new Set(pool);
  const items: Emoji[] = [];
  const chars: string[] = [];
  for (const char of recent) {
    const e = findEmoji(char);
    if (e && allowed.has(e)) {
      items.push(e);
      chars.push(char);
    }
  }
  return {
    items,
    chars,
  };
};

/** Puts `char` (a variant of `e`) first, drops the other skin-tone variants of `e`, and keeps at most `max`. */
export const addRecent = (recent: string[], e: Emoji, char: string, max: number): string[] =>
  [char, ...recent.filter((c) => findEmoji(c) !== e)].slice(0, max);

/**
 * While searching: one "search" section, or none when nothing matches so the list shows its empty text.
 * Otherwise: recent (when shown), then every non-empty category.
 */
export const buildSections = ({ query, pool, recent, showRecent, categories }: EmojiSectionsOptions): EmojiSection[] => {
  if (query.trim()) {
    const items = searchEmojis(query, pool);
    return items.length ? [{ key: EMOJI_SECTION.search, items }] : [];
  }
  const sections: EmojiSection[] =
    showRecent && recent.items.length ? [{ key: EMOJI_SECTION.recent, items: recent.items, chars: recent.chars }] : [];
  for (const key of categories) {
    const items = pool.filter((e) => e.category === key);
    if (items.length) sections.push({ key, items });
  }
  return sections;
};

/** Flattens sections into fixed-height rows so FlatList can skip measuring and the category bar can jump. */
export const buildLayout = (sections: EmojiSection[], columns: number, cellSize: number, showSectionHeaders: boolean): EmojiLayout => {
  const rows: EmojiRow[] = [];
  const offsets: number[] = [];
  const headerIndex = new Map<EmojiSectionKey, number>();
  let y = 0;
  const push = (row: EmojiRow, height: number) => {
    rows.push(row);
    offsets.push(y);
    y += height;
  };
  for (const section of sections) {
    headerIndex.set(section.key, rows.length);
    if (showSectionHeaders) push({ type: EMOJI_ROW_TYPE.header, key: section.key }, SECTION_HEADER_HEIGHT);
    for (let i = 0; i < section.items.length; i += columns) {
      push(
        {
          type: EMOJI_ROW_TYPE.emojis,
          items: section.items.slice(i, i + columns),
          chars: section.chars?.slice(i, i + columns),
          section: section.key,
        },
        cellSize
      );
    }
  }
  return {
    rows,
    offsets,
    headerIndex,
  };
};

/** Index of the last row starting at or above `y` (binary search over ascending offsets). */
export const rowIndexAtOffset = (offsets: number[], y: number): number => {
  let lo = 0;
  let hi = offsets.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if ((offsets[mid] ?? 0) <= y) lo = mid;
    else hi = mid - 1;
  }
  return lo;
};

export const sectionOfRow = (row: EmojiRow): EmojiSectionKey => (row.type === EMOJI_ROW_TYPE.header ? row.key : row.section);

export const getRowHeight = (row: EmojiRow | undefined, cellSize: number) =>
  row?.type === EMOJI_ROW_TYPE.header ? SECTION_HEADER_HEIGHT : cellSize;

/** Keyed by section and first emoji, not position, so rows keep their cells when recents are added above them. */
export const getRowKey = (row: EmojiRow) =>
  row.type === EMOJI_ROW_TYPE.header ? `h-${row.key}` : `r-${row.section}-${row.items[0]?.emoji}`;

export const getCellSize = (width: number, columns: number) => (width > 0 ? Math.floor(width / columns) : FALLBACK_CELL_SIZE);

export const getEmojiFontSize = (cellSize: number, emojiSize?: number) => emojiSize ?? Math.round(cellSize * EMOJI_TO_CELL_RATIO);

export const getInitialRowCount = (height: number, cellSize: number) => Math.ceil(height / cellSize) + INITIAL_ROW_BUFFER;

/** Category bar tabs: recent first, then the categories that have a section. */
export const getVisibleTabs = (categories: EmojiCategory[], headerIndex: Map<EmojiSectionKey, number>): EmojiTabKey[] =>
  ([EMOJI_SECTION.recent, ...categories] as EmojiTabKey[]).filter((key) => headerIndex.has(key));
