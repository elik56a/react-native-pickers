import { FALLBACK_CELL_SIZE, SECTION_HEADER_HEIGHT } from './emoji.constants';
import type { Emoji, EmojiSection } from './emoji.types';
import {
  addRecent,
  buildLayout,
  buildSections,
  filterEmojis,
  getCellSize,
  getEmojiFontSize,
  getInitialRowCount,
  getRowHeight,
  getRowKey,
  getVisibleTabs,
  resolveRecent,
  rowIndexAtOffset,
  searchEmojis,
  sectionOfRow,
  withSkinTone,
} from './emoji.utils';
import { findEmoji, getAllEmojis } from './emojis';

const emoji = (char: string) => findEmoji(char) as Emoji;

describe('emoji data', () => {
  it('parses all categories', () => {
    const all = getAllEmojis();
    expect(all.length).toBeGreaterThan(1800);
    expect(new Set(all.map((e) => e.category)).size).toBe(9);
  });

  it('looks up skin-tone variants and ignores FE0F', () => {
    const wave = emoji('👋');
    expect(findEmoji('👋🏽')).toBe(wave);
    expect(findEmoji('👍')).toBeDefined();
    expect(findEmoji('❤')).toBe(findEmoji('❤️'));
  });
});

describe('withSkinTone', () => {
  it('picks the tone variant and falls back to the base emoji', () => {
    expect(withSkinTone(emoji('👋'), 3)).toBe('👋🏽');
    expect(withSkinTone(emoji('👋'), 0)).toBe('👋');
    expect(withSkinTone(emoji('🍕'), 3)).toBe('🍕');
  });
});

describe('searchEmojis', () => {
  it('ranks name prefix first and requires every term', () => {
    expect(searchEmojis('pizza')[0]?.emoji).toBe('🍕');
    expect(searchEmojis('heart eyes').map((e) => e.name)).toContain('smiling face with heart-eyes');
    expect(searchEmojis('pizza zzzz')).toEqual([]);
  });

  it('returns nothing for a blank query', () => {
    expect(searchEmojis('   ')).toEqual([]);
  });

  it('searches only the given list', () => {
    expect(searchEmojis('face', [emoji('🍕'), emoji('😀')])).toEqual([emoji('😀')]);
  });
});

describe('filterEmojis', () => {
  const all = [emoji('😀'), emoji('🍕'), emoji('🫠')];

  it('keeps shown categories only', () => {
    expect(filterEmojis(all, ['food'])).toEqual([emoji('🍕')]);
  });

  it('drops excluded and too-new emojis', () => {
    expect(filterEmojis(all, ['smileys', 'food'], ['🍕'])).toEqual([emoji('😀'), emoji('🫠')]);
    expect(filterEmojis(all, ['smileys'], undefined, 13)).toEqual([emoji('😀')]);
  });

  it('excludes regardless of variation selector or skin tone', () => {
    const hands = [emoji('👍'), emoji('👋')];
    expect(filterEmojis(hands, ['people'], ['👍\uFE0F', '👋🏽'])).toEqual([]);
  });
});

describe('recent', () => {
  it('resolves characters in the pool, in order', () => {
    expect(resolveRecent(['🍕', 'nope', '👋🏽', '😀'], [emoji('😀'), emoji('👋')])).toEqual([emoji('👋'), emoji('😀')]);
  });

  it('moves the pick to the front, dedupes tone variants and caps the length', () => {
    expect(addRecent(['😀', '👋🏽', '🍕'], emoji('👋'), 3)).toEqual(['👋', '😀', '🍕']);
    expect(addRecent(['😀', '🍕'], emoji('👋'), 2)).toEqual(['👋', '😀']);
  });
});

describe('buildSections', () => {
  const pool = [emoji('😀'), emoji('🍕'), emoji('🍔')];
  const base = {
    query: '',
    pool,
    recent: [emoji('🍕')],
    showRecent: true,
    categories: ['smileys' as const, 'animals' as const, 'food' as const],
  };

  it('puts recent first and skips empty categories', () => {
    expect(buildSections(base).map((s) => s.key)).toEqual(['recent', 'smileys', 'food']);
  });

  it('hides recent when disabled or empty', () => {
    expect(buildSections({ ...base, showRecent: false })[0]?.key).toBe('smileys');
    expect(buildSections({ ...base, recent: [] })[0]?.key).toBe('smileys');
  });

  it('shows a single search section while searching', () => {
    expect(buildSections({ ...base, query: 'pizza' })).toEqual([{ key: 'search', items: [emoji('🍕')] }]);
    expect(buildSections({ ...base, query: 'zzzz' })).toEqual([]);
  });
});

describe('buildLayout', () => {
  const sections: EmojiSection[] = [
    { key: 'recent', items: [emoji('🍕')] },
    { key: 'food', items: [emoji('🍕'), emoji('🍔'), emoji('🌭')] },
  ];

  it('chunks rows by column count with header offsets', () => {
    const { rows, offsets, headerIndex } = buildLayout(sections, 2, 40, true);
    expect(rows.map((r) => (r.type === 'header' ? r.key : r.items.length))).toEqual(['recent', 1, 'food', 2, 1]);
    expect(offsets).toEqual([0, 32, 72, 104, 144]);
    expect(headerIndex.get('food')).toBe(2);
  });

  it('points sections at their first emoji row without headers', () => {
    const { rows, offsets, headerIndex } = buildLayout(sections, 2, 40, false);
    expect(rows).toHaveLength(3);
    expect(offsets).toEqual([0, 40, 80]);
    expect(headerIndex.get('food')).toBe(1);
  });
});

describe('rowIndexAtOffset', () => {
  const offsets = [0, 32, 72, 104];

  it('finds the last row starting at or above y', () => {
    expect(rowIndexAtOffset(offsets, 0)).toBe(0);
    expect(rowIndexAtOffset(offsets, 31)).toBe(0);
    expect(rowIndexAtOffset(offsets, 32)).toBe(1);
    expect(rowIndexAtOffset(offsets, 500)).toBe(3);
  });

  it('handles an empty list', () => {
    expect(rowIndexAtOffset([], 10)).toBe(0);
  });
});

describe('row helpers', () => {
  const header = { type: 'header' as const, key: 'food' as const };
  const row = { type: 'emojis' as const, items: [emoji('🍕')], section: 'food' as const };

  it('maps rows to sections, heights and keys', () => {
    expect(sectionOfRow(header)).toBe('food');
    expect(sectionOfRow(row)).toBe('food');
    expect(getRowHeight(header, 40)).toBe(SECTION_HEADER_HEIGHT);
    expect(getRowHeight(row, 40)).toBe(40);
    expect(getRowHeight(undefined, 40)).toBe(40);
    expect(getRowKey(header)).toBe('h-food');
    expect(getRowKey(row)).toBe('r-food-🍕');
  });
});

describe('sizing', () => {
  it('derives cell and font size from the measured width', () => {
    expect(getCellSize(0, 8)).toBe(FALLBACK_CELL_SIZE);
    expect(getCellSize(330, 8)).toBe(41);
    expect(getEmojiFontSize(40)).toBe(25);
    expect(getEmojiFontSize(40, 30)).toBe(30);
    expect(getInitialRowCount(380, 40)).toBe(12);
  });
});

describe('getVisibleTabs', () => {
  it('lists recent then categories that have a section', () => {
    const headerIndex = new Map([
      ['recent' as const, 0],
      ['food' as const, 2],
    ]);
    expect(getVisibleTabs(['smileys', 'food'], headerIndex)).toEqual(['recent', 'food']);
  });
});
