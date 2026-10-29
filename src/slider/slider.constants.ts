import type { Design } from '../core/theme/theme.types';
import type { SliderDesign } from './slider.types';

export const SLIDER_THUMB = {
  /** iOS: a white knob with a shadow */
  knob: 'knob',
  /** Material 3: a slim bar, with a gap to the track either side */
  bar: 'bar',
  /** The web: a solid dot in the primary colour */
  dot: 'dot',
} as const;

/** When the value bubble shows over a thumb. */
export const SLIDER_VALUE_LABEL = {
  never: 'never',
  /** While the thumb is dragged */
  drag: 'drag',
  always: 'always',
} as const;

/** iOS's UISlider, Material 3's slider and a browser's range input. */
export const SLIDER_DESIGN: Record<Design, SliderDesign> = {
  ios: {
    thumb: SLIDER_THUMB.knob,
    thumbWidth: 28,
    thumbHeight: 28,
    pressedThumbWidth: 28,
    trackHeight: 4,
    innerRadius: 2,
    gap: 0,
    inactiveTrack: 'border',
    markSize: 2,
    stopIndicators: false,
    valueLabel: SLIDER_VALUE_LABEL.never,
    halo: 0,
  },
  material: {
    thumb: SLIDER_THUMB.bar,
    thumbWidth: 4,
    thumbHeight: 44,
    pressedThumbWidth: 2,
    trackHeight: 16,
    innerRadius: 2,
    gap: 6,
    inactiveTrack: 'primaryMuted',
    markSize: 4,
    stopIndicators: true,
    valueLabel: SLIDER_VALUE_LABEL.drag,
    halo: 0,
  },
  web: {
    thumb: SLIDER_THUMB.dot,
    thumbWidth: 18,
    thumbHeight: 18,
    pressedThumbWidth: 18,
    trackHeight: 6,
    innerRadius: 3,
    gap: 0,
    inactiveTrack: 'border',
    markSize: 2,
    stopIndicators: false,
    valueLabel: SLIDER_VALUE_LABEL.never,
    halo: 40,
  },
};

/** How strongly a thumb's halo shows: on hover or keyboard focus, and stronger, grown in, while pressed. */
export const HALO_LEVEL = {
  none: 0,
  hover: 1,
  pressed: 2,
} as const;
/** The halo's opacity (of the primary colour) and size at each level. */
export const HALO_OPACITY = [0, 0.12, 0.24];
export const HALO_SCALE = [0.5, 0.8, 1];

export const DEFAULT_SLIDER_MIN = 0;
export const DEFAULT_SLIDER_MAX = 100;
export const DEFAULT_SLIDER_STEP = 1;
/** A continuous slider (`step` 0) moves this fraction of its range per arrow key or screen-reader step. */
export const CONTINUOUS_STEP_FRACTION = 0.01;
/** Page Up and Page Down move this fraction of the range. */
export const PAGE_FRACTION = 0.1;
/** A continuous value is shown with this many decimals. */
export const CONTINUOUS_DECIMALS = 2;
/** Step marks closer than this many px would run together, so they're left out. */
export const MIN_MARK_SPACING = 8;
export const DEFAULT_THUMB_LABELS: [string, string] = ['Minimum', 'Maximum'];
export const SLIDER_DISABLED_OPACITY = 0.38;
/** The value bubble's box, centred over the thumb; the bubble inside is as wide as its text. */
export const VALUE_LABEL_BOX_WIDTH = 120;
export const VALUE_LABEL_GAP = 4;
/** Room kept above the track for a bubble that always shows. */
export const VALUE_LABEL_SPACE = 32;
/** A mark's label box, centred under its mark; the text inside is as wide as it needs. */
export const MARK_LABEL_BOX_WIDTH = 80;
/** Pulls the mark labels up into the touch area's empty space under the track. */
export const MARK_LABEL_OFFSET = -10;
