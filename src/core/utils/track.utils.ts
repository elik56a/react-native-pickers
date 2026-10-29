export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export const clamp01 = (n: number) => clamp(n, 0, 1);

/** Rounds away float noise, so 0.1 + 0.2 lands on 0.3. */
export const roundTo = (n: number, decimals: number) => Number(n.toFixed(decimals));

/** How many decimals a step has: 0.25 → 2, 5 → 0. */
export const stepDecimals = (step: number) => String(step).split('.')[1]?.length ?? 0;

/** A value between 0 and 1 from a touch `at` along a length. */
export const toFraction = (at: number, length: number) => (length > 0 ? clamp01(at / length) : 0);
