export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export const clamp01 = (n: number) => clamp(n, 0, 1);

/** A value between 0 and 1 from a touch `at` along a length. */
export const toFraction = (at: number, length: number) => (length > 0 ? clamp01(at / length) : 0);
