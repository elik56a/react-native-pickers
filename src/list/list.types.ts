import type React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { PickerTheme, SlotStyles, ThemableProps } from '../core';
import type { ValueOf } from '../core/core.types';
import type { HORIZONTAL_LIST_VARIANT } from './list.constants';

export interface HorizontalListItem<T> {
  label: string;
  value: T;
  disabled?: boolean;
  /** Leading element: icon, avatar, flag... */
  icon?: React.ReactNode;
}

export type HorizontalListVariant = ValueOf<typeof HORIZONTAL_LIST_VARIANT>;

export type HorizontalListSlot = 'container' | 'content' | 'item' | 'selectedItem' | 'itemLabel' | 'selectedItemLabel' | 'thumb';

export interface HorizontalListRenderItemInfo<T> {
  item: HorizontalListItem<T>;
  selected: boolean;
  disabled: boolean;
  theme: PickerTheme;
}

export type HorizontalListProps<T> = ThemableProps & {
  items: ReadonlyArray<HorizontalListItem<T>>;
  value?: T | null;
  onChange?: (value: T, item: HorizontalListItem<T>) => void;
  isEqual?: (a: T, b: T) => boolean;
  /** 'segmented': items on a track, the selected one on a sliding thumb. 'chips': separate pills. Default: 'segmented' */
  variant?: HorizontalListVariant;
  /** Custom item content, inside the pressable item */
  renderItem?: (info: HorizontalListRenderItemInfo<T>) => React.ReactNode;
  /** Names the list for screen readers */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  styles?: SlotStyles<HorizontalListSlot>;
  testID?: string;
};

export interface ItemLayout {
  x: number;
  width: number;
}

/** The visible window of a horizontal scroll view over its content. */
export interface ScrollFrame {
  offset: number;
  width: number;
  contentWidth: number;
}

export interface ListItemProps<T> {
  item: HorizontalListItem<T>;
  selected: boolean;
  variant: HorizontalListVariant;
  renderItem?: HorizontalListProps<T>['renderItem'];
  onPress: () => void;
  onLayout: (layout: ItemLayout) => void;
  theme: PickerTheme;
  slots?: SlotStyles<HorizontalListSlot>;
  testID?: string;
}
