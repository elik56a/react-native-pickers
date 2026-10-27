import type React from 'react';
import type { RefObject } from 'react';
import type { Animated, GestureResponderHandlers, HostInstance, LayoutChangeEvent, StyleProp, TextStyle, ViewStyle } from 'react-native';

import type { PickerTheme, SlotStyles, ThemableProps } from '../core';
import type { DistributiveOmit, ValueOf } from '../core/core.types';
import type { FIELD_PRESENTATION, SHEET_PRESENTATION, SHEET_SNAP } from './sheet.constants';

/** `auto`: a centered modal on web windows wider than the sheet, a bottom sheet everywhere else. */
export type SheetPresentation = ValueOf<typeof SHEET_PRESENTATION>;

/** A sheet presentation, or `dropdown`: a popover under the field. */
export type FieldPresentation = ValueOf<typeof FIELD_PRESENTATION>;

export interface FieldSheetContextValue {
  presentation: FieldPresentation;
  /** The field, measured when a dropdown opens */
  anchor: AnchorRect | null;
}

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
  /** Drag the sheet down (wheel down on the web) to dismiss. Default: true */
  enableSwipeToClose?: boolean;
  /** The header row is a drag area too, not just the handle. Default: true on native, false on the web (where mouse drags there would select text) */
  draggable?: boolean;
  /** Let the sheet grow to `expandedHeight`: drag the handle up, or wheel up on the web. Default: true */
  expandable?: boolean;
  /** Expanded height (px, or a fraction of the window when <= 1). Default: the window below the status bar */
  expandedHeight?: number;
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

/** Where a drag or a wheel gesture leaves the sheet. */
export type SheetSnap = ValueOf<typeof SHEET_SNAP>;

export interface SheetDragFrame {
  height: number;
  /** How far the sheet is pulled below its base height, towards closing. */
  offset: number;
}

export interface SheetResizeOptions {
  /** True while the sheet is shown. */
  active: boolean;
  drag: Animated.Value;
  draggable: boolean;
  expandable: boolean;
  swipeToClose: boolean;
  expandedHeight: number;
  duration: number;
  onClose: () => void;
}

export interface SheetResize {
  sheetRef: RefObject<HostInstance | null>;
  panHandlers: GestureResponderHandlers;
  onLayout: (e: LayoutChangeEvent) => void;
  /** The sheet's height while `sized`. */
  height: Animated.Value;
  /** True while dragging or expanded: `height` drives the sheet instead of its content. */
  sized: boolean;
}

/** The parts of a DOM element the web wheel handling reads; the library builds without DOM typings. */
export interface ScrollNode {
  parentElement: ScrollNode | null;
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
}

export interface WheelEventLike {
  deltaY: number;
  target: ScrollNode | null;
  preventDefault: () => void;
}

export interface WheelHost extends ScrollNode {
  addEventListener: (type: 'wheel', listener: (e: WheelEventLike) => void, options: { passive: boolean }) => void;
  removeEventListener: (type: 'wheel', listener: (e: WheelEventLike) => void) => void;
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
  /** Drawn exactly over the anchor field, e.g. an input that stands in for it while open */
  overlay?: React.ReactNode;
  maxHeight?: number;
  /** Wider than the anchor when it's narrower than this, still within the window */
  minWidth?: number;
  testID?: string;
}

export interface ChevronInfo {
  open: boolean;
  theme: PickerTheme;
}

export interface ChevronProps {
  open: boolean;
  renderChevron?: (info: ChevronInfo) => React.ReactNode;
  theme: PickerTheme;
  style?: StyleProp<ViewStyle>;
}

export type PickerFieldSlot = 'label' | 'trigger' | 'triggerText' | 'placeholder' | 'chevron' | 'clear';

export interface PickerFieldTriggerInfo {
  open: () => void;
  displayValue: string;
  disabled: boolean;
}

/** The props every `*PickerField` shares; `styles` also reaches the picker inside the sheet, so it takes the picker's slots `S` too. */
export interface PickerFieldBaseProps<S extends string = never> extends ThemableProps {
  /** Label rendered above the field, and the sheet title unless `title` is set */
  label?: string;
  /** Default: 'Select…' */
  placeholder?: string;
  /** Text shown in the field. Default: the value, formatted for `locale` */
  displayValue?: string;
  disabled?: boolean;
  /** Show a clear (×) button while the field has a value; reset your value in `onClear` */
  clearable?: boolean;
  onClear?: () => void;
  /** Custom trigger: render anything and call `open()` */
  renderTrigger?: (info: PickerFieldTriggerInfo) => React.ReactNode;
  /** Custom chevron icon; it still rotates as the field opens and closes */
  renderChevron?: (info: ChevronInfo) => React.ReactNode;
  onOpen?: () => void;
  onClose?: () => void;
  /** Where the picker opens: `dropdown` under the field, `bottomSheet`, `modal`, or `auto` (modal on wide web windows, else a bottom sheet). Default: 'dropdown' */
  presentation?: FieldPresentation;
  style?: StyleProp<ViewStyle>;
  styles?: SlotStyles<PickerFieldSlot | S>;
  /** On the default trigger */
  testID?: string;
}

export interface PickerFieldProps extends PickerFieldBaseProps {
  /** Render the sheet the field opens, passing it `visible` and `onClose` */
  children: (sheet: Pick<SheetChromeProps, 'visible' | 'onClose'>) => React.ReactNode;
}

/** A sheet's props turned into a field's: no `visible`, and the field props in place of the picker's own `style`, `testID`... */
export type WithPickerField<SheetProps, S extends string> = DistributiveOmit<SheetProps, 'visible' | keyof PickerFieldBaseProps> &
  PickerFieldBaseProps<S>;

export interface FieldLabelProps {
  label: string;
  theme: PickerTheme;
  style?: StyleProp<TextStyle>;
}

export interface FieldTriggerProps {
  displayValue: string;
  /** Leading element before `displayValue` */
  icon?: React.ReactNode;
  /** Replaces the value or placeholder, e.g. with chips */
  children?: React.ReactNode;
  placeholder: string;
  label?: string;
  open: boolean;
  disabled: boolean;
  clearable: boolean;
  onOpen: () => void;
  onClear?: () => void;
  renderChevron?: (info: ChevronInfo) => React.ReactNode;
  theme: PickerTheme;
  slots?: SlotStyles<PickerFieldSlot>;
  testID?: string;
}
