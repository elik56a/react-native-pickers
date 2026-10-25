import type React from 'react';

import type { PickerTheme, SlotStyles, ThemableProps } from '../core';

/** `auto`: a centered modal on web windows wider than the sheet, a bottom sheet everywhere else. */
export type SheetPresentation = 'auto' | 'bottomSheet' | 'modal';

export type BottomSheetSlot = 'backdrop' | 'sheet' | 'handle' | 'header' | 'title' | 'content' | 'footer';

export interface BottomSheetProps extends ThemableProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: React.ReactNode;
  /** Rendered on the right side of the header (e.g. a Done button) */
  headerRight?: React.ReactNode;
  headerLeft?: React.ReactNode;
  footer?: React.ReactNode;
  /** Drag the sheet down to dismiss. Default: true */
  enableSwipeToClose?: boolean;
  /** Tap the backdrop to dismiss. Default: true */
  closeOnBackdropPress?: boolean;
  /** Max sheet height as a fraction of the window. Default: 0.9 */
  maxHeightRatio?: number;
  /** Fixed sheet height (px or fraction of the window when <= 1) */
  height?: number;
  /** Extra bottom padding for home indicators. Default: 24 on iOS, 12 elsewhere */
  bottomInset?: number;
  /** Default: 'auto' */
  presentation?: SheetPresentation;
  styles?: SlotStyles<BottomSheetSlot>;
  onOpened?: () => void;
  onClosed?: () => void;
  testID?: string;
}

export interface SheetChromeProps extends ThemableProps {
  visible: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  /** Default: 'Done' */
  confirmLabel?: string;
  /** Default: 'Cancel' */
  cancelLabel?: string;
  /** Show the cancel button. Default: true */
  showCancel?: boolean;
  /** Bottom sheet or centered modal. Default: 'auto' (modal on wide web windows) */
  presentation?: SheetPresentation;
  /** Passed through to the underlying BottomSheet */
  sheetProps?: Partial<Omit<BottomSheetProps, 'visible' | 'onClose' | 'children'>>;
}

export interface PickerSheetProps extends SheetChromeProps {
  onConfirm?: () => void;
  confirmDisabled?: boolean;
  children: React.ReactNode;
}

export interface SheetContentProps {
  children: React.ReactNode;
  /** Narrower side padding, for content with its own inner spacing (e.g. a calendar). */
  compact?: boolean;
}

export interface SheetHeaderProps {
  title?: React.ReactNode;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  theme: PickerTheme;
  slots?: SlotStyles<BottomSheetSlot>;
}

export interface SheetButtonProps {
  label: string;
  onPress: () => void;
  primary?: boolean;
  disabled?: boolean;
  theme: PickerTheme;
}

export interface SheetAnimationOptions {
  visible: boolean;
  duration: number;
  /** How far the sheet travels while opening: the window height for a bottom sheet, a short rise for a dialog. */
  slideDistance: number;
  onOpened?: () => void;
  onClosed?: () => void;
}

/** A view's position in window coordinates, from `measureInWindow`. */
export interface AnchorRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DropdownFrame {
  left: number;
  width: number;
  top?: number;
  bottom?: number;
  maxHeight: number;
}

export interface DropdownProps extends ThemableProps {
  visible: boolean;
  /** The field the dropdown opens from; nothing renders until it's measured. */
  anchor: AnchorRect | null;
  onClose: () => void;
  children: React.ReactNode;
  maxHeight?: number;
  testID?: string;
}
