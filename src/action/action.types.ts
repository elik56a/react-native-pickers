import type React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { PickerTheme, SlotStyles, ThemableProps } from '../core';
import type { ValueOf } from '../core/core.types';
import type { BottomSheetProps, FieldAnchor, SheetPresentation } from '../sheet/sheet.types';
import type { MENU_ALIGN, MENU_PRESENTATION } from './action.constants';

export interface ActionSheetAction {
  label: string;
  /** Runs after the sheet has closed, so it can open another sheet or modal */
  onPress?: () => void;
  /** A second line under the label */
  description?: string;
  /** Shown before the label, such as a 24px icon */
  icon?: React.ReactNode;
  /** Marks the current choice with a ✓, as in a Sort by sheet */
  selected?: boolean;
  /** Drawn in the theme's `danger` colour, for Delete and the like */
  destructive?: boolean;
  disabled?: boolean;
  testID?: string;
}

export type ActionSheetSlot =
  | 'group'
  | 'header'
  | 'title'
  | 'message'
  | 'action'
  | 'actionLabel'
  | 'actionDescription'
  | 'check'
  | 'cancel'
  | 'cancelLabel';

export interface ActionSheetProps extends ThemableProps {
  visible: boolean;
  /** Called on Cancel, a backdrop tap, a swipe down or Back, and before any action runs */
  onClose: () => void;
  actions: ActionSheetAction[];
  title?: string;
  /** A line under the title, such as what a Delete removes */
  message?: string;
  /** Default: 'Cancel' */
  cancelLabel?: string;
  /** A Cancel button after the actions. Default: true in the iOS design; Material and web sheets close on a backdrop tap */
  showCancel?: boolean;
  /** Bottom sheet or centered modal. Default: 'auto' (modal on wide web windows) */
  presentation?: SheetPresentation;
  /** Passed through to the underlying BottomSheet */
  sheetProps?: Partial<Omit<BottomSheetProps, 'visible' | 'onClose' | 'children'>>;
  styles?: SlotStyles<ActionSheetSlot>;
  testID?: string;
}

export interface ActionSheetDesign {
  /** Rounded cards floating over the backdrop, Cancel in a card of its own (iOS), or rows on a plain sheet */
  grouped: boolean;
  showCancel: boolean;
  rowHeight: number;
}

export interface ActionSheetHeaderProps {
  title?: string;
  message?: string;
  grouped: boolean;
  theme: PickerTheme;
  slots?: SlotStyles<ActionSheetSlot>;
}

export interface ActionSheetRowProps {
  action: ActionSheetAction;
  onPress: (action: ActionSheetAction) => void;
  grouped: boolean;
  /** The Cancel button: bold in the iOS design */
  cancel?: boolean;
  /** A hairline above the row, between grouped actions */
  separated: boolean;
  rowHeight: number;
  /** After the label, as iOS menus put it */
  iconAtEnd?: boolean;
  theme: PickerTheme;
  slots?: SlotStyles<ActionSheetSlot>;
}

/** `show()` takes the sheet's props without `visible`; `onClose` is optional. */
export type ActionSheetOptions = Omit<ActionSheetProps, 'visible' | 'onClose'> & { onClose?: () => void };

/** What `useActionSheet` returns: render `actionSheet` once, then call `show` from anywhere in the component. */
export interface ActionSheetController {
  show: (options: ActionSheetOptions) => void;
  hide: () => void;
  actionSheet: React.ReactElement | null;
}

/** What `useActionPress` hands the sheet. Named so the build can emit the hook returning it. */
export interface ActionPress {
  press: (action: ActionSheetAction) => void;
  onClosed: () => void;
}

/** A menu takes the same actions as an action sheet. */
export type MenuAction = ActionSheetAction;

/** Which edge of the trigger the menu lines up with; `auto`: its end when the trigger is in the window's far half. */
export type MenuAlign = ValueOf<typeof MENU_ALIGN>;

/** `menu`: a popover by the trigger; `sheet`: an ActionSheet. */
export type MenuPresentation = ValueOf<typeof MENU_PRESENTATION>;

export interface MenuTriggerInfo {
  open: () => void;
  visible: boolean;
}

export type MenuSlot = 'trigger' | 'menu' | 'header' | 'title' | 'action' | 'actionLabel' | 'actionDescription' | 'check';

export interface MenuProps extends ThemableProps {
  actions: MenuAction[];
  /** The trigger: a node that opens the menu on press, or a function that gets `open` for your own button */
  children: React.ReactNode | ((info: MenuTriggerInfo) => React.ReactNode);
  /** A small heading above the actions */
  title?: string;
  /** Default: 'auto' */
  align?: MenuAlign;
  /** Default: 250 in the iOS design, 200 otherwise */
  width?: number;
  /** Default: 'menu' */
  presentation?: MenuPresentation;
  /** Open on a long press instead of a tap, as a context menu. Default: false */
  openOnLongPress?: boolean;
  disabled?: boolean;
  onOpen?: () => void;
  /** On a tap outside, Back or Escape, and before any action runs */
  onClose?: () => void;
  /** What screen readers call the trigger, such as 'More options' */
  accessibilityLabel?: string;
  /** The box around the trigger */
  style?: StyleProp<ViewStyle>;
  styles?: SlotStyles<MenuSlot>;
  /** On the trigger; the menu gets `${testID}-menu` */
  testID?: string;
}

export interface MenuDesign {
  width: number;
  rowHeight: number;
  /** iOS puts icons after the label and a hairline between actions */
  iconAtEnd: boolean;
  separators: boolean;
  /** A small centered title (iOS), or one at the start */
  centeredTitle: boolean;
}

/** What `useMenu` hands the menu. Named so the build can emit the hook returning it. */
export interface MenuState extends ActionPress {
  anchor: FieldAnchor;
  visible: boolean;
  open: () => void;
  close: () => void;
}
