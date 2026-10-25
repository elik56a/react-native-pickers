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

import type { PickerTheme } from './theme/theme.types';

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends (...args: never[]) => unknown ? T[K] : T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/** Per-slot style overrides. Every component exposes its own slot names. */
export type SlotStyles<K extends string> = Partial<Record<K, StyleProp<TextStyle>>>;

export interface ThemableProps {
  /** Component-level theme override, merged on top of the provider theme */
  theme?: DeepPartial<PickerTheme>;
}

export interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  autoFocus?: boolean;
  theme: PickerTheme;
  style?: StyleProp<TextStyle>;
}

/** Where a ripple starts inside its element, and how big it grows to cover the farthest corner. */
export interface RippleOrigin {
  x: number;
  y: number;
  radius: number;
}

export interface TouchFeedbackProps {
  hovered: boolean;
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
  /** Spread a ripple from the touch point on press. Default: true */
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
