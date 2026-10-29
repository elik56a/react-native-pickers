import type React from 'react';
import type { GestureResponderHandlers, LayoutChangeEvent, PointerEvent, StyleProp, ViewProps, ViewStyle } from 'react-native';

import type { SlotStyles, ThemableProps } from '../core';

/** What a custom icon is drawn with. Each star draws it twice: empty, then filled and cut to the rating. */
export interface RatingIconInfo {
  index: number;
  filled: boolean;
  color: string;
  size: number;
}

export type RatingSlot = 'container' | 'item' | 'icon';

export interface RatingProps extends ThemableProps {
  value?: number;
  /** Default: 0, no stars */
  defaultValue?: number;
  /** On a tap, when a drag ends on a new value, or on a key or screen-reader step */
  onChange?: (value: number) => void;
  /** How many stars. Default: 5 */
  max?: number;
  /** The value moves in steps this big: 0.5 for half stars. Default: 1 */
  step?: number;
  /** Shows the value, any fraction such as 4.3, and takes no touches or keys. Default: false */
  readOnly?: boolean;
  disabled?: boolean;
  /** Each star's width and height. Default: 32 */
  size?: number;
  /** The filled stars. Default: gold */
  color?: string;
  /** The empty stars. Default: the theme's border colour */
  emptyColor?: string;
  /** Your own icon instead of ★: a heart, a thumb, an image */
  renderIcon?: (info: RatingIconInfo) => React.ReactNode;
  /** The value as screen readers hear it. Default: '3 of 5' */
  formatValue?: (value: number, max: number) => string;
  /** What screen readers call the rating. Default: 'Rating' */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  styles?: SlotStyles<RatingSlot>;
  /** On the row; star `i` gets `${testID}-star-${i}` */
  testID?: string;
}

/** Where a star sits in the row, for turning a touch into a value. */
export interface RatingGeometry {
  size: number;
  gap: number;
  max: number;
  step: number;
}

export interface RatingItemState {
  key: string;
  index: number;
  /** How much of the star is filled, 0–1 */
  fill: number;
}

/** What `useRating` hands the row. Named so the build can emit the hook returning it. */
export interface RatingState {
  items: RatingItemState[];
  gap: number;
  interactive: boolean;
  a11y: ViewProps;
  panHandlers?: GestureResponderHandlers;
  hoverHandlers?: {
    onPointerMove: (e: PointerEvent) => void;
    onPointerLeave: () => void;
  };
  onLayout: (e: LayoutChangeEvent) => void;
}

export interface RatingIconProps {
  info: RatingIconInfo;
  renderIcon?: RatingProps['renderIcon'];
  slots?: SlotStyles<RatingSlot>;
}

export interface RatingItemProps {
  item: RatingItemState;
  size: number;
  color: string;
  emptyColor: string;
  renderIcon?: RatingProps['renderIcon'];
  slots?: SlotStyles<RatingSlot>;
  testID?: string;
}
