import type React from 'react';
import type { RefObject } from 'react';
import type {
  Animated,
  GestureResponderEvent,
  HostInstance,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import type { DIRECTION, KEY, PICKER_DISPLAY, PRESS_FEEDBACK } from './core.constants';
import type { Design, PickerTheme } from './theme/theme.types';

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends (...args: never[]) => unknown ? T[K] : T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/** The union of an object's values, e.g. the strings of an `as const` lookup. */
export type ValueOf<T> = T[keyof T];

export type PickerDisplay = ValueOf<typeof PICKER_DISPLAY>;

/** `Omit` that keeps a union a union, so discriminated props (like a sheet's `mode`) still narrow. */
export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

/** A BCP 47 language tag passed to `Intl`, e.g. `'en-US'` or `'he'`. Default: the device locale. */
export type Locale = string;

/** Per-slot style overrides. Every component exposes its own slot names. */
export type SlotStyles<K extends string> = Partial<Record<K, StyleProp<TextStyle>>>;

export interface ThemableProps {
  /** Component-level theme override, merged on top of the provider theme */
  theme?: DeepPartial<PickerTheme>;
  /** Draw this design instead of the provider's or the platform's: 'ios', 'material' or 'web' */
  design?: Design;
}

export interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  autoFocus?: boolean;
  theme: PickerTheme;
  /** The text field itself: its fill, border, corners and text */
  style?: StyleProp<TextStyle>;
  /** The box around the field and its magnifier, for layout (e.g. `flex: 1` in a row) */
  containerStyle?: StyleProp<ViewStyle>;
}

/** Where a ripple starts inside its element, and how big it grows to cover the farthest corner. */
export interface RippleOrigin {
  x: number;
  y: number;
  radius: number;
}

export type PressFeedback = ValueOf<typeof PRESS_FEEDBACK>;

/** How a design draws its search field. */
export interface SearchDesign {
  height: number;
  radius: keyof PickerTheme['radius'];
  /** A border around the field, on the picker's background, instead of a gray fill */
  outlined: boolean;
  /** A primary-colored ring while focused. Designs without it rely on the caret, except on the web, where keyboard users need the ring */
  focusRing: boolean;
  /** Space before the magnifier */
  iconInset: keyof PickerTheme['spacing'];
}

export interface TouchFeedbackProps {
  hovered: boolean;
  /** Held down, in designs that dim what's pressed rather than ripple */
  pressed: boolean;
  ripple: RippleOrigin | null;
  scale: Animated.Value;
  opacity: Animated.Value;
  theme: PickerTheme;
  /** Match the element's corners, so the tint and ripple stay inside its shape. */
  borderRadius?: number;
}

export interface TouchFeedbackState {
  ref: RefObject<HostInstance | null>;
  handlers: {
    onPressIn: (e: GestureResponderEvent) => void;
    onPressOut: () => void;
    onHoverIn: () => void;
    onHoverOut: () => void;
  };
  feedback: Omit<TouchFeedbackProps, 'borderRadius'>;
}

export type TouchableProps = Omit<PressableProps, 'style' | 'children'> & {
  theme: PickerTheme;
  /** Show press feedback: a ripple from the touch point, or a dim while held, as the design does it. Default: true */
  ripple?: boolean;
  style?: StyleProp<ViewStyle> | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>);
  children?: React.ReactNode | ((state: PressableStateCallbackType) => React.ReactNode);
};

export interface TimingOptions {
  duration: number;
  /** Default: `EASE_OUT` */
  easing?: (value: number) => number;
  delay?: number;
  /** Default: `USE_NATIVE_DRIVER`. Pass `false` for layout props such as `height`. */
  native?: boolean;
}

export interface SpringOptions {
  bounciness?: number;
  speed?: number;
  /** Default: `USE_NATIVE_DRIVER` */
  native?: boolean;
}

export interface PresenceOptions {
  visible: boolean;
  /** Exit duration, and the entry duration unless `enterDuration` is set. */
  duration: number;
  enterDuration?: number;
  onShown?: () => void;
  onHidden?: () => void;
}

export interface Presence {
  /** Stays true until the exit animation finishes, so the content can animate out before it unmounts. */
  mounted: boolean;
  /** 0 hidden → 1 shown. */
  progress: Animated.Value;
}

/** A page sliding in: its fade and its sideways offset. */
export interface SlideStyle {
  opacity: Animated.AnimatedInterpolation<number>;
  transform: { translateX: Animated.AnimatedInterpolation<number> }[];
}

export type Key = ValueOf<typeof KEY>;
export type Direction = ValueOf<typeof DIRECTION>;
export type KeyHandlers = Partial<Record<Key, () => void>>;

/** A box on screen, as `getBoundingClientRect` gives it. */
export interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}
