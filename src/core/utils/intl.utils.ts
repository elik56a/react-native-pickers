/** `fn()`, or `fallback` when it throws or returns nothing: `Intl` support varies by engine and locale (Hermes has no `Intl.DisplayNames`). */
export const safe = <T>(fn: () => T | null | undefined, fallback: T): T => {
  try {
    const v = fn();
    return v ?? fallback;
  } catch {
    return fallback;
  }
};
