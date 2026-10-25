import { findEmoji, getAllEmojis, searchEmojis, withSkinTone } from '../emoji/emojis';
import { defaultFilter } from '../select/select.utils';

describe('emoji data', () => {
  test('parses all categories', () => {
    const all = getAllEmojis();
    expect(all.length).toBeGreaterThan(1800);
    expect(new Set(all.map((e) => e.category)).size).toBe(9);
  });
  test('search ranks name prefix first', () => {
    expect(searchEmojis('pizza')[0]!.emoji).toBe('🍕');
    expect(searchEmojis('heart eyes').map((e) => e.name)).toContain('smiling face with heart-eyes');
    expect(searchEmojis('   ')).toEqual([]);
  });
  test('skin tones and lookup ignore FE0F', () => {
    const wave = findEmoji('👋')!;
    expect(withSkinTone(wave, 3)).toBe('👋🏽');
    expect(findEmoji('👋🏽')).toBe(wave);
    expect(findEmoji('👍')).toBeDefined();
    expect(findEmoji('❤')).toBe(findEmoji('❤️'));
  });
});

describe('select filter', () => {
  test('matches label, keywords, diacritics and niqqud', () => {
    const o = { label: 'Café Ñandú', value: 1, keywords: ['שָׁלוֹם'] };
    expect(defaultFilter(o, 'cafe nandu')).toBe(true);
    expect(defaultFilter(o, 'שלום')).toBe(true);
    expect(defaultFilter(o, 'tea')).toBe(false);
  });
});
