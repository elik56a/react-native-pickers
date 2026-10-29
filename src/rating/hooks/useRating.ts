import { useRef, useState } from 'react';
import { I18nManager, type LayoutChangeEvent, type PointerEvent } from 'react-native';

import { useControllableState } from '../../core/hooks/useControllableState';
import { useTrackPan } from '../../core/hooks/useTrackPan';
import type { PickerTheme } from '../../core/theme/theme.types';
import { adjustableProps } from '../../core/utils/adjustable.utils';
import { toFraction } from '../../core/utils/track.utils';
import { DEFAULT_RATING_LABEL, DEFAULT_RATING_MAX, DEFAULT_RATING_SIZE, DEFAULT_RATING_STEP } from '../rating.constants';
import type { RatingProps, RatingState } from '../rating.types';
import { formatRating, getFills, isOnStars, ratingAt, stepRating } from '../rating.utils';

/**
 * The rating and what the row shows: a drag previews its value and commits on release, and on the web the pointer
 * previews the value a click would pick.
 */
export const useRating = (props: RatingProps, theme: PickerTheme): RatingState => {
  const {
    max = DEFAULT_RATING_MAX,
    step = DEFAULT_RATING_STEP,
    size = DEFAULT_RATING_SIZE,
    readOnly = false,
    disabled = false,
    formatValue = formatRating,
    accessibilityLabel = DEFAULT_RATING_LABEL,
  } = props;
  const gap = theme.spacing.xs;
  const geometry = {
    size,
    gap,
    max,
    step,
  };
  const interactive = !readOnly && !disabled;
  const [value, commit] = useControllableState(props.value, props.defaultValue ?? 0, props.onChange);
  const [drag, setDrag] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  // The pan reads these between renders, so a fast drag never commits a stale value.
  const live = useRef<number | null>(null);
  const grabbed = useRef(false);
  const width = useRef(0);

  const set = (next: number) => {
    if (next !== value) commit(next);
  };
  // Touches come in screen coordinates; the stars run from the row's start, which is the right edge in RTL.
  const xAt = (fraction: number) => (I18nManager.isRTL ? 1 - fraction : fraction) * width.current;
  const moveTo = (fraction: number) => {
    if (!grabbed.current) return;
    live.current = ratingAt(xAt(fraction), geometry);
    setDrag(live.current);
  };
  const pan = useTrackPan({
    // A row wider than its stars ignores touches in the empty space after them; a drag that starts on a star can still run past it.
    onStart: (fraction) => {
      grabbed.current = isOnStars(xAt(fraction), geometry);
      moveTo(fraction);
    },
    onMove: moveTo,
    onEnd: () => {
      const next = live.current;
      live.current = null;
      grabbed.current = false;
      setDrag(null);
      if (next !== null) set(next);
    },
  });
  const hoverAt = (offsetX: number) => {
    const x = xAt(toFraction(offsetX, width.current));
    setHover(isOnStars(x, geometry) ? ratingAt(x, geometry) : null);
  };

  const valueText = formatValue(value, max);
  const shown = drag ?? hover ?? value;

  return {
    items: getFills(shown, max).map((fill, index) => ({
      key: String(index),
      index,
      fill,
    })),
    gap,
    interactive,
    a11y: readOnly
      ? {
          accessible: true,
          accessibilityRole: 'text',
          accessibilityLabel,
          accessibilityValue: { text: valueText },
        }
      : adjustableProps({
          label: accessibilityLabel,
          valueText,
          disabled,
          onStep: (direction) => set(stepRating(value, direction, step, max)),
          onMin: () => set(0),
          onMax: () => set(max),
        }),
    panHandlers: interactive ? pan.panHandlers : undefined,
    // offsetX is on the row, as the stars let the pointer through.
    hoverHandlers: interactive
      ? {
          onPointerMove: (e: PointerEvent) => hoverAt(e.nativeEvent.offsetX),
          onPointerLeave: () => setHover(null),
        }
      : undefined,
    onLayout: (e: LayoutChangeEvent) => {
      pan.onLayout(e);
      width.current = e.nativeEvent.layout.width;
    },
  };
};
