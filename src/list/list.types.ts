import type React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { PickerTheme, SlotStyles, ThemableProps } from '../core';
import type { ValueOf } from '../core/core.types';
import type { HORIZONTAL_LIST_VARIANT, ICON_POSITION } from './list.constants';

/** What an item's icon can match: its state and its label's color. */
export interface HorizontalListIconInfo {
  selected: boolean;
  disabled: boolean;
  color: string;
}

export interface HorizontalListItem<T> {
  label: string;
  value: T;
  disabled?: boolean;
  /** An icon, avatar, flag... beside the label, or a function of the item's state to color it like the label */
  icon?: React.ReactNode | ((info: HorizontalListIconInfo) => React.ReactNode);
}

export type HorizontalListVariant = ValueOf<typeof HORIZONTAL_LIST_VARIANT>;

export type HorizontalListIconPosition = ValueOf<typeof ICON_POSITION>;

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
  /** Where each item's icon sits around its label. 'left' and 'right' follow the layout direction, so they swap in RTL. Default: 'left' */
  iconPosition?: HorizontalListIconPosition;
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

export interface ListDesign {
  /** Outlined segments and chips, the chosen one filled and checked, instead of a sliding thumb */
  outlined: boolean;
}

export interface ListItemProps<T> {
  item: HorizontalListItem<T>;
  selected: boolean;
  /** Not the first item, so an outlined segment draws a divider before it */
  divided: boolean;
  variant: HorizontalListVariant;
  iconPosition: HorizontalListIconPosition;
  renderItem?: HorizontalListProps<T>['renderItem'];
  onPress: () => void;
  onLayout: (layout: ItemLayout) => void;
  theme: PickerTheme;
  slots?: SlotStyles<HorizontalListSlot>;
  testID?: string;
}
