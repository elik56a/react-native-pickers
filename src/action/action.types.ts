import type React from 'react';

import type { PickerTheme, SlotStyles, ThemableProps } from '../core';
import type { BottomSheetProps, SheetPresentation } from '../sheet/sheet.types';

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
