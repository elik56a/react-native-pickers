import type { SelectOption } from './SelectList';

/** Lowercase and strip Latin diacritics and Hebrew niqqud. */
const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-֑ͯ-ׇ]/g, '');

export function defaultFilter<T>(o: SelectOption<T>, q: string): boolean {
  const hay = fold([o.label, o.description ?? '', ...(o.keywords ?? [])].join(' '));
  return fold(q)
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => hay.includes(term));
}

