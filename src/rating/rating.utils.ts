import { clamp, clamp01, roundTo, stepDecimals } from '../core/utils/track.utils';
import { STEP_PRECISION } from './rating.constants';
import type { RatingGeometry } from './rating.types';

const stepsIn = (value: number, step: number) => roundTo(value / step, STEP_PRECISION);

/** The rating a touch `x` px from the row's start picks: the star under it, filled up to the next step, and at least one step. */
export const ratingAt = (x: number, { size, gap, max, step }: RatingGeometry) => {
  const pitch = size + gap;
  const index = Math.floor(x / pitch);
  const reached = index + clamp01((x - index * pitch) / size);
  return clamp(roundTo(Math.ceil(stepsIn(reached, step)) * step, stepDecimals(step)), step, max);
};

/** Whether a touch `x` px from the row's start is on the stars, not in the empty row after them. */
export const isOnStars = (x: number, { size, gap, max }: RatingGeometry) => x <= max * (size + gap) - gap;

/** One step up or down from `value`, landing on the step grid even when the value is between steps. */
export const stepRating = (value: number, direction: 1 | -1, step: number, max: number) => {
  const steps = stepsIn(value, step);
  const next = (direction > 0 ? Math.floor(steps) + 1 : Math.ceil(steps) - 1) * step;
  return clamp(roundTo(next, stepDecimals(step)), 0, max);
};

/** How much of each star `value` fills: 3.5 of 5 → 1, 1, 1, 0.5, 0. */
export const getFills = (value: number, max: number) => Array.from({ length: max }, (_, i) => clamp01(value - i));

export const formatRating = (value: number, max: number) => `${roundTo(value, 2)} of ${max}`;
