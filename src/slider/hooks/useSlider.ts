import { useRef, useState } from 'react';
import { I18nManager, type LayoutChangeEvent, type PointerEvent } from 'react-native';

import { useControllableState } from '../../core/hooks/useControllableState';
import { useTrackPan } from '../../core/hooks/useTrackPan';
import type { PickerTheme } from '../../core/theme/theme.types';
import { adjustableProps } from '../../core/utils/adjustable.utils';
import { toFraction } from '../../core/utils/track.utils';
import {
  DEFAULT_SLIDER_MAX,
  DEFAULT_SLIDER_MIN,
  DEFAULT_SLIDER_STEP,
  DEFAULT_THUMB_LABELS,
  PAGE_FRACTION,
  SLIDER_DESIGN,
  SLIDER_VALUE_LABEL,
} from '../slider.constants';
import type { SliderProps, SliderRange, SliderThumbState } from '../slider.types';
import {
  formatSliderValue,
  getHaloLevel,
  getKeyStep,
  getMarkLabels,
  getMarks,
  getThumbOffset,
  getTrackSegments,
  moveThumb,
  nearestMark,
  nearestThumb,
  normalizeMarks,
  sameValues,
  snapValue,
  stepToMark,
  toThumbValues,
  valueToFraction,
} from '../slider.utils';

/**
 * The slider's value, held while dragging and committed on release, and where everything sits on the track.
 * `onValueChanging` fires on each step of a drag; `onChange` once the finger lifts, or on a key or screen-reader step.
 */
export const useSlider = (props: SliderProps, theme: PickerTheme) => {
  const { min = DEFAULT_SLIDER_MIN, max = DEFAULT_SLIDER_MAX, step = DEFAULT_SLIDER_STEP, disabled = false, showSteps = false } = props;
  const design = SLIDER_DESIGN[theme.design];
  const range = !!props.range;
  const format = props.formatValue ?? ((v: number) => formatSliderValue(v, step));
  const report = (values: number[]) => (range ? (values as SliderRange) : (values[0] ?? min));
  const marks = normalizeMarks(props.marks ?? [], min, max);
  const markValues = marks.map((mark) => mark.value);
  const onMarks = !!props.snapToMarks && markValues.length > 0;
  const snap = (value: number) => (onMarks ? nearestMark(value, markValues) : snapValue(value, min, max, step));

  const [committed, commit] = useControllableState<number[]>(
    props.value === undefined ? undefined : toThumbValues(props.value, min, max),
    () => toThumbValues(props.defaultValue ?? (range ? [min, max] : min), min, max),
    (next) => (props.onChange as ((value: number | SliderRange) => void) | undefined)?.(report(next))
  );
  const [drag, setDrag] = useState<number[] | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [width, setWidth] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  // The pan reads these between renders, so a fast drag never works from a stale value.
  const live = useRef({ drag: null as number[] | null, thumb: 0 });
  const values = drag ?? committed;

  // Touches come in screen coordinates; the track runs from its start, which is the right edge in RTL.
  const fromStart = (fraction: number) => (I18nManager.isRTL ? 1 - fraction : fraction);
  const valueAt = (fraction: number) => snap(min + fromStart(fraction) * (max - min));
  const moveTo = (fraction: number) => {
    const from = live.current.drag ?? committed;
    const next = moveThumb(from, live.current.thumb, valueAt(fraction));
    if (sameValues(next, from)) return;
    live.current.drag = next;
    setDrag(next);
    (props.onValueChanging as ((value: number | SliderRange) => void) | undefined)?.(report(next));
  };
  const pan = useTrackPan({
    insetX: design.thumbWidth / 2,
    onStart: (fraction) => {
      const thumb = nearestThumb(
        committed.map((v) => valueToFraction(v, min, max)),
        fromStart(fraction)
      );
      live.current = { drag: null, thumb };
      setDragging(thumb);
      moveTo(fraction);
    },
    onMove: moveTo,
    onEnd: () => {
      const next = live.current.drag;
      live.current.drag = null;
      setDrag(null);
      setDragging(null);
      if (next && !sameValues(next, committed)) commit(next);
    },
  });

  const setThumb = (index: number, value: number) => {
    const next = moveThumb(committed, index, snap(value));
    if (!sameValues(next, committed)) commit(next);
  };
  const keyStep = getKeyStep(min, max, step);
  const pageStep = Math.max(keyStep, (max - min) * PAGE_FRACTION);
  const stepFrom = (value: number, direction: 1 | -1, by: number) =>
    onMarks ? stepToMark(value, markValues, direction) : value + direction * by;
  const valueLabel = props.valueLabel ?? design.valueLabel;
  const thumbLabels = props.range ? (props.thumbLabels ?? DEFAULT_THUMB_LABELS) : [];

  const inset = design.thumbWidth / 2;
  const offsets = values.map((v) => getThumbOffset(valueToFraction(v, min, max), width, inset));
  const cut = design.gap > 0 ? design.gap + design.thumbWidth / 2 : 0;
  const halo = {
    enabled: design.halo > 0 && !disabled,
    dragging,
    hovered,
    focused,
  };
  const thumbs: SliderThumbState[] = values.map((value, i) => ({
    key: String(i),
    x: offsets[i] ?? 0,
    width: dragging === i ? design.pressedThumbWidth : design.thumbWidth,
    dragging: dragging === i,
    showValueLabel: valueLabel === SLIDER_VALUE_LABEL.always || (valueLabel === SLIDER_VALUE_LABEL.drag && dragging === i),
    halo: getHaloLevel(i, halo),
    valueText: format(value),
    adjustable: adjustableProps({
      label: thumbLabels[i] ?? props.accessibilityLabel,
      valueText: format(value),
      disabled,
      onStep: (direction) => setThumb(i, stepFrom(value, direction, keyStep)),
      onPage: (direction) => setThumb(i, stepFrom(value, direction, pageStep)),
      onMin: () => setThumb(i, min),
      onMax: () => setThumb(i, max),
    }),
    onFocus: () => setFocused(i),
    onBlur: () => setFocused(null),
  }));

  return {
    design,
    thumbs,
    segments: getTrackSegments(width, offsets, range, cut),
    marks: getMarks({
      min,
      max,
      step,
      width,
      inset,
      thumbs: offsets,
      range,
      cut,
      showSteps,
      stopIndicators: design.stopIndicators,
      custom: markValues.map((v) => valueToFraction(v, min, max)),
    }),
    markLabels: getMarkLabels(marks, { min, max, width, inset, thumbs: offsets, range }),
    reserveValueLabel: valueLabel === SLIDER_VALUE_LABEL.always,
    panHandlers: disabled ? undefined : pan.panHandlers,
    // The thumb a click would grab: offsetX is on the track, as the thumbs let the pointer through.
    hoverHandlers: design.halo
      ? {
          onPointerMove: (e: PointerEvent) =>
            setHovered(
              nearestThumb(
                values.map((v) => valueToFraction(v, min, max)),
                fromStart(toFraction(e.nativeEvent.offsetX - inset, width - 2 * inset))
              )
            ),
          onPointerLeave: () => setHovered(null),
        }
      : undefined,
    onLayout: (e: LayoutChangeEvent) => {
      pan.onLayout(e);
      setWidth(e.nativeEvent.layout.width);
    },
  };
};
