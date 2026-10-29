import { clamp, roundTo, stepDecimals } from '../core/utils/track.utils';
import { CONTINUOUS_DECIMALS, CONTINUOUS_STEP_FRACTION, HALO_LEVEL, MIN_MARK_SPACING } from './slider.constants';
import type {
  HaloLevel,
  HaloState,
  MarkOptions,
  SliderMark,
  SliderMarkInput,
  SliderMarkLabel,
  SliderRange,
  TrackSegment,
} from './slider.types';

const decimalsOf = (step: number) => (step > 0 ? stepDecimals(step) : CONTINUOUS_DECIMALS);

/** The value in range, on the nearest step counted from `min`. */
export const snapValue = (value: number, min: number, max: number, step: number) => {
  const snapped = step > 0 ? min + Math.round((value - min) / step) * step : value;
  return clamp(roundTo(snapped, decimalsOf(step)), min, max);
};

export const valueToFraction = (value: number, min: number, max: number) => (max > min ? clamp((value - min) / (max - min), 0, 1) : 0);

export const fractionToValue = (fraction: number, min: number, max: number, step: number) =>
  snapValue(min + fraction * (max - min), min, max, step);

/** How far an arrow key or a screen reader's step moves: one step, or a hundredth of a continuous range. */
export const getKeyStep = (min: number, max: number, step: number) => (step > 0 ? step : (max - min) * CONTINUOUS_STEP_FRACTION);

/** A thumb's centre, px from the track's start: `inset` in from either end, where it stops. */
export const getThumbOffset = (fraction: number, width: number, inset: number) => inset + fraction * Math.max(0, width - 2 * inset);

/** The thumb a touch at `fraction` grabs: the nearest, or on a tie (thumbs stacked) the one on the touch's side. */
export const nearestThumb = (fractions: readonly number[], fraction: number) => {
  let best = 0;
  fractions.forEach((f, i) => {
    const d = Math.abs(f - fraction);
    const bestD = Math.abs((fractions[best] ?? 0) - fraction);
    if (d < bestD || (d === bestD && fraction >= f)) best = i;
  });
  return best;
};

/** Moves one thumb, kept between its neighbours so a range's start never passes its end. */
export const moveThumb = (values: readonly number[], index: number, next: number) =>
  values.map((v, i) => (i === index ? clamp(next, values[index - 1] ?? -Infinity, values[index + 1] ?? Infinity) : v));

export const sameValues = (a: readonly number[], b: readonly number[]) => a.length === b.length && a.every((v, i) => v === b[i]);

/** The thumbs' values from a single value or a range, kept in range and in order. */
export const toThumbValues = (value: number | SliderRange, min: number, max: number) =>
  (Array.isArray(value) ? [...value].sort((a, b) => a - b) : [value]).map((v) => clamp(v, min, max));

export const formatSliderValue = (value: number, step: number) => String(roundTo(value, decimalsOf(step)));

/**
 * The track cut at the thumbs, `cut` px either side of each (Material's gap). A single slider is active from its start
 * to the thumb; a range between its thumbs.
 */
export const getTrackSegments = (width: number, thumbs: readonly number[], range: boolean, cut: number): TrackSegment[] => {
  const edges = [0, ...thumbs, width];
  const last = edges.length - 2;
  return edges
    .slice(1)
    .map((end, i) => ({
      key: String(i),
      start: (edges[i] ?? 0) + (i > 0 ? cut : 0),
      end: end - (i < last ? cut : 0),
      active: range ? i === 1 : i === 0,
      outerStart: i === 0,
      outerEnd: i === last,
    }))
    .filter((segment) => segment.end > segment.start);
};

const isActiveAt = (x: number, thumbs: readonly number[], range: boolean) =>
  range ? x >= (thumbs[0] ?? 0) && x <= (thumbs[1] ?? 0) : x <= (thumbs[0] ?? 0);

/**
 * Dots on the track: one per step with `showSteps` (unless they'd run together), else Material's stop indicators at
 * the inactive ends. None in a thumb's gap.
 */
export const getMarks = ({
  min,
  max,
  step,
  width,
  inset,
  thumbs,
  range,
  cut,
  showSteps,
  stopIndicators,
  custom,
}: MarkOptions): SliderMark[] => {
  const count = step > 0 ? Math.floor((max - min) / step) : 0;
  const steps = custom.length > 0 || (showSteps && count > 0 && (width - 2 * inset) / count >= MIN_MARK_SPACING);
  const stepFractions = () => Array.from({ length: count + 1 }, (_, i) => (i * step) / (max - min));
  const fractions = custom.length > 0 ? custom : steps ? stepFractions() : stopIndicators ? [0, 1] : [];
  return fractions
    .map((f) => {
      const x = getThumbOffset(f, width, inset);
      return {
        key: String(f),
        x,
        active: isActiveAt(x, thumbs, range),
      };
    })
    .filter((mark) => (steps || !mark.active) && thumbs.every((t) => Math.abs(t - mark.x) > cut));
};

/** A thumb's halo: pressed while dragged, faint while hovered or focused, none without a halo or while disabled. */
export const getHaloLevel = (index: number, { enabled, dragging, hovered, focused }: HaloState): HaloLevel => {
  if (!enabled) return HALO_LEVEL.none;
  if (dragging === index) return HALO_LEVEL.pressed;
  return hovered === index || focused === index ? HALO_LEVEL.hover : HALO_LEVEL.none;
};

/** The `marks` prop as `{ value, label }`, in range and in order. */
export const normalizeMarks = (marks: ReadonlyArray<number | SliderMarkInput>, min: number, max: number) =>
  marks
    .map((mark) => (typeof mark === 'number' ? { value: mark } : mark))
    .filter((mark) => mark.value >= min && mark.value <= max)
    .sort((a, b) => a.value - b.value);

/** The mark nearest `value`, or `value` itself without marks. */
export const nearestMark = (value: number, marks: readonly number[]) =>
  marks.reduce((best, mark) => (Math.abs(mark - value) < Math.abs(best - value) ? mark : best), marks[0] ?? value);

/** The next mark up (1) or down (-1) from `value`, or `value` at the last one. */
export const stepToMark = (value: number, marks: readonly number[], direction: 1 | -1) =>
  (direction > 0 ? marks.find((mark) => mark > value) : [...marks].reverse().find((mark) => mark < value)) ?? value;

/** The marks that have a label, placed like the thumbs; a label is active inside the filled part of the track. */
export const getMarkLabels = (
  marks: readonly SliderMarkInput[],
  { min, max, width, inset, thumbs, range }: Pick<MarkOptions, 'min' | 'max' | 'width' | 'inset' | 'thumbs' | 'range'>
): SliderMarkLabel[] =>
  marks.flatMap(({ value, label }) => {
    if (!label) return [];
    const x = getThumbOffset((value - min) / (max - min), width, inset);
    return [
      {
        key: String(value),
        x,
        label,
        active: isActiveAt(x, thumbs, range),
      },
    ];
  });
