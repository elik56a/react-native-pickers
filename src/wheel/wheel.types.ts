import type React from 'react';
import type { Animated, StyleProp, TextStyle, ViewStyle } from 'react-native';

import type { PickerTheme, SlotStyles, ThemableProps } from '../core';
import type { ValueOf } from '../core/core.types';
import type { SheetChromeProps, WithPickerField } from '../sheet';
import type { SETTLE_KIND, WHEEL_VARIANT } from './wheel.constants';

export interface WheelItem<T> {
  label: string;
  value: T;
  disabled?: boolean;
  key?: string;
}

export type WheelItemInput<T> = WheelItem<T> | (T extends string | number ? T : never);

export type WheelVariant = ValueOf<typeof WHEEL_VARIANT>;

export type WheelPickerSlot = 'container' | 'item' | 'itemText' | 'selectedItemText' | 'disabledItemText' | 'indicator';

export interface WheelRenderItemInfo<T> {
  item: WheelItem<T>;
  index: number;
  selected: boolean;
  theme: PickerTheme;
}

export interface WheelPickerProps<T> extends ThemableProps {
  /** Items: primitives (`[1, 2, 3]`) or objects (`{ label, value, disabled }`) */
  items: ReadonlyArray<WheelItemInput<T>>;
  /** Selected value (controlled). */
  value?: T;
  /** Initial value when uncontrolled. */
  defaultValue?: T;
  /** Fires when the wheel settles on a new value. */
  onChange?: (value: T, index: number) => void;
  /** Fires on every item crossing while scrolling. Hook haptics here. */
  onValueChanging?: (value: T, index: number) => void;
  /** Row height. Default: 40 */
  itemHeight?: number;
  /** Visible rows (odd number). Default: 5 */
  visibleItems?: number;
  /** Infinite wheel. Default: false */
  loop?: boolean;
  /** Tap the selected row to type a value; the wheel jumps to the first matching label. Default: true */
  keyboardInput?: boolean;
  /** '3d' cylinder or 'flat' list. Default: '3d' */
  variant?: WheelVariant;
  /** Degrees between rows on the 3d cylinder. Default: 20 */
  rotation?: number;
  /** Opacity of the farthest visible rows. Default: 0.3 */
  fadeTo?: number;
  /** Custom row renderer. */
  renderItem?: (info: WheelRenderItemInfo<T>) => React.ReactNode;
  /** Show the selection band. Default: true */
  showIndicator?: boolean;
  renderIndicator?: (theme: PickerTheme) => React.ReactNode;
  textAlign?: TextStyle['textAlign'];
  disabled?: boolean;
  /** Custom equality for object values. Default: Object.is */
  isEqual?: (a: T, b: T) => boolean;
  style?: StyleProp<ViewStyle>;
  styles?: SlotStyles<WheelPickerSlot>;
  accessibilityLabel?: string;
  testID?: string;
}

// biome-ignore lint/suspicious/noExplicitAny: columns mix value types, and their callbacks are contravariant, so `unknown` can't hold them.
export type WheelColumn<T = any> = Omit<WheelPickerProps<T>, 'itemHeight' | 'visibleItems' | 'variant' | 'showIndicator' | 'theme'> & {
  key: string;
  /** Flex weight of the column. Default: 1 */
  flex?: number;
  /** Fixed column width */
  width?: number;
  /** Text after the column at the selection band, such as a unit ('min'). */
  suffix?: string;
};

export type MultiWheelSlot = 'container' | 'indicator' | 'separator' | WheelPickerSlot;

export interface MultiWheelPickerProps extends ThemableProps {
  columns: WheelColumn[];
  /** Text/node rendered between columns, e.g. ':' for time */
  separator?: React.ReactNode | ((leftIndex: number) => React.ReactNode);
  itemHeight?: number;
  visibleItems?: number;
  variant?: WheelVariant;
  style?: StyleProp<ViewStyle>;
  styles?: SlotStyles<MultiWheelSlot>;
  testID?: string;
}

export type WheelPickerSheetProps<T> = SheetChromeProps &
  Omit<WheelPickerProps<T>, 'value' | 'defaultValue' | 'onChange' | 'theme'> & {
    value?: T;
    onConfirm: (value: T) => void;
  };

export type WheelPickerFieldProps<T> = WithPickerField<WheelPickerSheetProps<T>, WheelPickerSlot>;

export interface WheelRowProps<T> {
  dataIndex: number;
  logicalIndex: number;
  item: WheelItem<T>;
  selected: boolean;
  itemHeight: number;
  visibleItems: number;
  scrollY: Animated.Value;
  variant: WheelVariant;
  rotation: number;
  fadeTo: number;
  theme: PickerTheme;
  textAlign: TextStyle['textAlign'];
  slots?: SlotStyles<WheelPickerSlot>;
  renderItem?: (info: WheelRenderItemInfo<T>) => React.ReactNode;
  onSelect?: (dataIndex: number) => void;
}

export interface WheelControlsOptions {
  wheel: {
    active: number;
    move: (step: number) => void;
    scrollToData: (dataIndex: number, animated: boolean) => void;
    scrollToLogical: (logicalIndex: number, animated: boolean) => void;
  };
  toggleTyping: () => void;
  keyboardInput: boolean;
  disabled: boolean;
  count: number;
}

/** A looping wheel repeats the items `copies` times; `middle` is where the centre copy starts. */
export interface WheelLayout {
  copies: number;
  middle: number;
  total: number;
}

export type SettleResult =
  | { kind: typeof SETTLE_KIND.snap; dataIndex: number }
  | { kind: typeof SETTLE_KIND.rest; logicalIndex: number; changed: boolean; recenterTo: number | null };

export interface RowFrames {
  inputRange: number[];
  opacity: number[];
  scale: number[];
  /** 3d variant only */
  translateY?: number[];
  /** 3d variant only, in degrees */
  rotateX?: string[];
}

export interface WheelIndicatorProps {
  itemHeight: number;
  theme: PickerTheme;
  style?: StyleProp<TextStyle>;
  renderIndicator?: (theme: PickerTheme) => React.ReactNode;
}

export interface WheelTypingInputProps {
  value: string;
  numeric: boolean;
  itemHeight: number;
  theme: PickerTheme;
  accessibilityLabel?: string;
  onChangeText: (text: string) => void;
  onDone: () => void;
}
