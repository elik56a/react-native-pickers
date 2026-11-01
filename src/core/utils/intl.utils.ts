import type { Locale } from '../core.types';

/** `fn()`, or `fallback` when it throws or returns nothing: `Intl` support varies by engine and locale (Hermes has no `Intl.DisplayNames`). */
export const safe = <T>(fn: () => T | null | undefined, fallback: T): T => {
  try {
    const v = fn();
    return v ?? fallback;
  } catch {
    return fallback;
  }
};

const displayNames = new Map<string, Intl.DisplayNames | null>();

/** Names of regions, languages… in `locale`, cached; null where the engine has no `Intl.DisplayNames` or doesn't know the locale. */
export const getDisplayNames = (type: Intl.DisplayNamesType, locale?: Locale) => {
  const key = `${type}|${locale ?? ''}`;
  if (!displayNames.has(key)) {
    displayNames.set(
      key,
      safe(() => new Intl.DisplayNames(locale, { type, fallback: 'none' }), null)
    );
  }
  return displayNames.get(key) ?? null;
};

/** Sorts names as `locale` does, or by code point where the engine has no `Intl.Collator`. */
export const getCompare = (locale?: Locale) =>
  safe(
    () => new Intl.Collator(locale).compare,
    (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0)
  );
