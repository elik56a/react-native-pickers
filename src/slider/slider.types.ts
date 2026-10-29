import type React from 'react';
import type { Animated, StyleProp, ViewStyle } from 'react-native';

import type { PickerTheme, SlotStyles, ThemableProps } from '../core';
import type { ValueOf } from '../core/core.types';
import type { adjustableProps } from '../core/utils/adjustable.utils';
import type { HALO_LEVEL, SLIDER_THUMB, SLIDER_VALUE_LABEL } from './slider.constants';

export type SliderThumbKind = ValueOf<typeof SLIDER_THUMB>;

/** When the value bubble shows: `never`, `drag` (while dragging) or `always`. */
export type SliderValueLabel = ValueOf<typeof SLIDER_VALUE_LABEL>;

/** A mark on the track, with an optional label under it. */
export interface SliderMarkInput {
  value: number;
  label?: string;
}

/** How a design draws the slider. */
export interface SliderDesign {
  thumb: SliderThumbKind;
  thumbWidth: number;
  thumbHeight: number;
  /** The thumb's width while dragged: Material's handle narrows */
  pressedThumbWidth: number;
  trackHeight: number;
  /** The track's corners beside a thumb; its outer ends are fully round */
  innerRadius: number;
  /** Space between the thumb and the track on either side */
  gap: number;
  inactiveTrack: keyof PickerTheme['colors'];
  markSize: number;
  /** Dots at the track's inactive ends, as Material 3 draws */
  stopIndicators: boolean;
  valueLabel: SliderValueLabel;
  /** A ring of colour around the thumb on hover, focus and press, as browsers draw; 0 for none */
  halo: number;
}

export type HaloLevel = ValueOf<typeof HALO_LEVEL>;

/** The halo's animated fade and size. Named so the build can emit the hook returning it. */
export interface HaloStyle {
  opacity: Animated.AnimatedInterpolation<number>;
  transform: [{ scale: Animated.AnimatedInterpolation<number> }];
}

/** Which thumb is dragged, hovered and focused, by index. */
export interface HaloState {
  /** The design draws a halo and the slider isn't disabled */
  enabled: boolean;
  dragging: number | null;
  hovered: number | null;
  focused: number | null;
}

export type SliderSlot = 'container' | 'track' | 'activeTrack' | 'thumb' | 'mark' | 'markLabel' | 'valueLabel' | 'valueLabelText';

/** A range slider's value: its start and end. */
export type SliderRange = [number, number];

interface SliderBaseProps extends ThemableProps {
  /** Default: 0 */
  min?: number;
  /** Default: 100 */
  max?: number;
  /** The value moves in steps this big; 0 for any value. Default: 1 */
  step?: number;
  disabled?: boolean;
  /** A dot at each step, when they're far enough apart to tell apart. Default: false */
  showSteps?: boolean;
  /** Marks on the track at these values; give one a `label` to write it under the track */
  marks?: ReadonlyArray<number | SliderMarkInput>;
  /** Only the `marks` can be picked: dragging and keys jump between them. Default: false */
  snapToMarks?: boolean;
  /** A bubble with the value over the thumb: 'never', 'drag' (while dragging) or 'always'. Default: 'drag' in the Material design, else 'never' */
  valueLabel?: SliderValueLabel;
  /** The value as text, for the bubble and screen readers. Default: the number, with the step's decimals */
  formatValue?: (value: number) => string;
  /** Before the track, like iOS's quiet speaker beside the volume slider */
  minimumIcon?: React.ReactNode;
  /** After the track */
  maximumIcon?: React.ReactNode;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  styles?: SlotStyles<SliderSlot>;
  testID?: string;
}

export interface SingleSliderProps extends SliderBaseProps {
  range?: false;
  value?: number;
  /** Default: `min` */
  defaultValue?: number;
  /** Once the user lets go on a new value, or steps it with a key or a screen reader */
  onChange?: (value: number) => void;
  /** On every step while dragging, for haptics and live previews */
  onValueChanging?: (value: number) => void;
}

export interface RangeSliderProps extends SliderBaseProps {
  /** Two thumbs: the value is `[start, end]` */
  range: true;
  value?: SliderRange;
  /** Default: `[min, max]` */
  defaultValue?: SliderRange;
  onChange?: (value: SliderRange) => void;
  onValueChanging?: (value: SliderRange) => void;
  /** What screen readers call the two thumbs. Default: ['Minimum', 'Maximum'] */
  thumbLabels?: [string, string];
}

export type SliderProps = SingleSliderProps | RangeSliderProps;

/** A piece of the track between its ends and the thumbs, in px from the start. */
export interface TrackSegment {
  key: string;
  start: number;
  end: number;
  active: boolean;
  /** Starts at the track's start rather than beside a thumb */
  outerStart: boolean;
  outerEnd: boolean;
}

export interface SliderMark {
  key: string;
  /** px from the start */
  x: number;
  active: boolean;
}

export interface SliderMarkLabel extends SliderMark {
  label: string;
}

export interface MarkLabelsProps {
  labels: SliderMarkLabel[];
  theme: PickerTheme;
  slots?: SlotStyles<SliderSlot>;
}

export interface MarkOptions {
  min: number;
  max: number;
  step: number;
  width: number;
  inset: number;
  /** The thumbs' centres, px from the start */
  thumbs: number[];
  range: boolean;
  /** Marks this close to a thumb hide in its gap */
  cut: number;
  showSteps: boolean;
  stopIndicators: boolean;
  /** The `marks` prop's fractions; they replace the steps and stops */
  custom: number[];
}

export interface SliderThumbState {
  key: string;
  /** px from the start */
  x: number;
  width: number;
  dragging: boolean;
  showValueLabel: boolean;
  halo: HaloLevel;
  valueText: string;
  adjustable: ReturnType<typeof adjustableProps>;
  onFocus: () => void;
  onBlur: () => void;
}

export interface SliderThumbProps {
  thumb: SliderThumbState;
  design: SliderDesign;
  theme: PickerTheme;
  slots?: SlotStyles<SliderSlot>;
  testID?: string;
}

export interface SliderHaloProps {
  x: number;
  level: HaloLevel;
  size: number;
  theme: PickerTheme;
  testID?: string;
}

export interface SliderTrackProps {
  segments: TrackSegment[];
  marks: SliderMark[];
  design: SliderDesign;
  theme: PickerTheme;
  slots?: SlotStyles<SliderSlot>;
}

export interface ValueLabelProps {
  x: number;
  text: string;
  design: SliderDesign;
  theme: PickerTheme;
  slots?: SlotStyles<SliderSlot>;
}
