import { RAW_EMOJI_DATA } from './data';

export type EmojiCategory = 'smileys' | 'people' | 'animals' | 'food' | 'travel' | 'activities' | 'objects' | 'symbols' | 'flags';

export interface Emoji {
  emoji: string;
  name: string;
  keywords: string[];
  category: EmojiCategory;
  /** Emoji (Unicode) version it was introduced in */
  version: number;
  /** Variants for skin tones 1–5 (light → dark) */
  skins?: string[];
}

export const EMOJI_CATEGORIES: EmojiCategory[] = [
  'smileys',
  'people',
  'animals',
  'food',
  'travel',
  'activities',
  'objects',
  'symbols',
  'flags',
];

export const DEFAULT_CATEGORY_LABELS: Record<EmojiCategory | 'recent' | 'search', string> = {
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

export const DEFAULT_CATEGORY_ICONS: Record<EmojiCategory | 'recent', string> = {
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

const GROUP_TO_CATEGORY: Record<string, EmojiCategory> = {
  '0': 'smileys',
  '1': 'people',
  '3': 'animals',
  '4': 'food',
  '5': 'travel',
  '6': 'activities',
  '7': 'objects',
  '8': 'symbols',
  '9': 'flags',
};

let cache: Emoji[] | null = null;
let byChar: Map<string, Emoji> | null = null;

/** All emojis, parsed lazily on first use. */
export function getAllEmojis(): Emoji[] {
  if (cache) return cache;
  cache = RAW_EMOJI_DATA.split('\n').map((line) => {
    const [group, emoji, name, tags, version, skins] = line.split('\t');
    return {
      emoji: emoji!,
      name: name!,
      keywords: tags ? tags.split(' ') : [],
      category: GROUP_TO_CATEGORY[group!] ?? 'symbols',
      version: Number(version),
      skins: skins ? skins.split(',') : undefined,
    };
  });
  return cache;
}

const stripVS = (s: string) => s.replace(/\uFE0F/g, '');

/** Look up an emoji by its character (also matches skin-tone variants, with or without U+FE0F). */
export function findEmoji(char: string): Emoji | undefined {
  if (!byChar) {
    byChar = new Map();
    for (const e of getAllEmojis()) {
      byChar.set(stripVS(e.emoji), e);
      for (const s of e.skins ?? []) byChar.set(stripVS(s), e);
    }
  }
  return byChar.get(stripVS(char));
}

/** Skin tone: 0 = default (yellow), 1–5 = light → dark */
export type SkinTone = 0 | 1 | 2 | 3 | 4 | 5;

export function withSkinTone(e: Emoji, tone: SkinTone): string {
  return tone > 0 && e.skins ? (e.skins[tone - 1] ?? e.emoji) : e.emoji;
}

export function searchEmojis(query: string, list: Emoji[] = getAllEmojis()): Emoji[] {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const scored: { e: Emoji; score: number }[] = [];
  for (const e of list) {
    let score = 0;
    let ok = true;
    for (const t of terms) {
      if (e.name.startsWith(t)) score += 3;
      else if (e.name.split(' ').some((w) => w.startsWith(t))) score += 2;
      else if (e.keywords.some((k) => k.startsWith(t))) score += 1;
      else if (e.name.includes(t)) score += 0.5;
      else {
        ok = false;
        break;
      }
    }
    if (ok) scored.push({ e, score });
  }
  return scored.sort((a, b) => b.score - a.score).map((x) => x.e);
}
