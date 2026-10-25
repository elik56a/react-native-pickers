import { RAW_EMOJI_DATA } from './data';
import { GROUP_TO_CATEGORY } from './emoji.constants';
import type { Emoji } from './emoji.types';

let cache: Emoji[] | null = null;
let byChar: Map<string, Emoji> | null = null;

const stripVariationSelector = (s: string) => s.replace(/️/g, '');

/** One tab-separated line of the generated data: group, emoji, name, keywords, version, skins. */
const parseLine = (line: string): Emoji => {
  const [group = '', emoji = '', name = '', tags, version, skins] = line.split('\t');
  return {
    emoji,
    name,
    keywords: tags ? tags.split(' ') : [],
    category: GROUP_TO_CATEGORY[group] ?? 'symbols',
    version: Number(version),
    skins: skins ? skins.split(',') : undefined,
  };
};

/** All emojis, parsed lazily on first use. */
export const getAllEmojis = (): Emoji[] => {
  cache ??= RAW_EMOJI_DATA.split('\n').map(parseLine);
  return cache;
};

/** Look up an emoji by its character (also matches skin-tone variants, with or without U+FE0F). */
export const findEmoji = (char: string): Emoji | undefined => {
  if (!byChar) {
    byChar = new Map();
    for (const e of getAllEmojis()) {
      byChar.set(stripVariationSelector(e.emoji), e);
      for (const skin of e.skins ?? []) byChar.set(stripVariationSelector(skin), e);
    }
  }
  return byChar.get(stripVariationSelector(char));
};
