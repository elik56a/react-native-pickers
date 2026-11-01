import type React from 'react';
import type { RefObject } from 'react';
import type {
  Animated,
  GestureResponderHandlers,
  HostInstance,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import type { PickerTheme, SlotStyles, ThemableProps } from '../core';
import type { DistributiveOmit, ValueOf } from '../core/core.types';
import type {
  FIELD_ARROW,
  FIELD_LABEL,
  FIELD_PRESENTATION,
  SHEET_ACTIONS,
  SHEET_PRESENTATION,
  SHEET_SNAP,
  TITLE_ALIGN,
} from './sheet.constants';

/** `auto`: a centered modal on web windows wider than the sheet, a bottom sheet everywhere else. */
export type SheetPresentation = ValueOf<typeof SHEET_PRESENTATION>;

/** A sheet presentation, `dropdown`: a popover under the field, or `inline`: expanded in place under the field. */
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
  /** The grab bar at the top of a bottom sheet. Default: true */
  showHandle?: boolean;
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
  /** Default: 'OK' in the Material design, else 'Done' */
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

export interface PickerSheetProps extends Omit<SheetChromeProps, 'presentation'> {
  /** Default: the field's presentation, else 'auto' */
  presentation?: FieldPresentation;
  onConfirm?: () => void;
  confirmDisabled?: boolean;
  children: React.ReactNode;
}

export interface DraftOptions<V> {
  /** Resets the draft to `value` when it changes, open or not */
  resetKey?: unknown;
  /** Called with each change in an `inline` field, which has no Done button */
  commit?: (v: V) => void;
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

export interface SheetDesign {
  /** Where Cancel and Done go: beside the title, or in a row at the bottom */
  actions: ValueOf<typeof SHEET_ACTIONS>;
  titleAlign: ValueOf<typeof TITLE_ALIGN>;
  confirmLabel: string;
}

export interface FieldDesign {
  /** Above the field, or inside it until there's a value and then on its top border */
  label: ValueOf<typeof FIELD_LABEL>;
  /** The open/close indicator: a chevron, or a filled triangle (Material) */
  arrow: ValueOf<typeof FIELD_ARROW>;
  minHeight: number;
  /** The border color while closed */
  outline: keyof PickerTheme['colors'];
  /** The border, in the primary color, while open */
  openBorderWidth: number;
  /** A soft ring around the field while open */
  focusRing: boolean;
}

export interface SheetDragFrame {
  height: number;
  /** How far the sheet is pulled below its base height, towards closing. */
  offset: number;
}

export interface SheetResizeOptions {
  /** True while the sheet is shown. */
  active: boolean;
  /** The open and close slide, added to the drag. */
  slide: Animated.AnimatedInterpolation<number>;
  draggable: boolean;
  expandable: boolean;
  swipeToClose: boolean;
  expandedHeight: number;
  onClose: () => void;
}

/** Scroll offsets of the drag area where the sheet is closed, at its base height and expanded; pulling down lowers it. */
export interface SheetDragStops {
  close: number;
  base: number;
  expanded: number;
}

export interface SheetDragAreaProps {
  contentHeight: number;
  initialOffset: number;
  snapToOffsets: number[];
  onScroll: ReturnType<typeof Animated.event>;
  onDragEnd: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  /** Cancels the sheet's own drag, so the area stays put under the finger while the sheet moves. */
  style: { transform: { translateY: Animated.AnimatedSubtraction }[] };
}

export interface SheetResize {
  sheetRef: RefObject<HostInstance | null>;
  /** The web's drag: a pointer can't scroll the native drag area. */
  panHandlers: GestureResponderHandlers | undefined;
  onLayout: (e: LayoutChangeEvent) => void;
  expanded: boolean;
  /** The sheet frame's slide and drag. Expanded, it hangs below the window by the extra height and is lifted back by the drag. */
  frameStyle: { marginBottom: number; transform: { translateY: Animated.AnimatedAddition }[] };
  /** The native drag: null on the web and before the sheet is measured. */
  dragArea: SheetDragAreaProps | null;
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

export interface SheetAnimation {
  mounted: boolean;
  progress: Animated.Value;
  /** How far below its place the sheet is, sliding in or out. */
  slide: Animated.AnimatedInterpolation<number>;
}

export interface SheetAnimationOptions {
  visible: boolean;
  duration: number;
  /** How far the sheet travels while opening: the window height for a bottom sheet, a short rise for a dialog. */
  slideDistance: number;
  onOpened?: () => void;
  onClosed?: () => void;
}

/** The field a dropdown opens from: attach `ref`, call `measure` on open, and read `rect`. Named so the build can emit the hooks returning it. */
export interface FieldAnchor {
  ref: RefObject<HostInstance | null>;
  rect: AnchorRect | null;
  measure: () => void;
}

/** A view's position in window coordinates, from `measureInWindow`. */
export interface AnchorRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** An inline picker's animated height and fade, and the `onLayout` that measures its content. */
export interface InlineExpand {
  mounted: boolean;
  style: { height: Animated.AnimatedInterpolation<number>; opacity: Animated.Value };
  onLayout: (e: LayoutChangeEvent) => void;
}

export interface InlinePanelProps {
  visible: boolean;
  children: React.ReactNode;
  theme: PickerTheme;
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
  /** Stays invisible while false, e.g. until its content is measured and it knows which side of the field it fits on. Default: true */
  ready?: boolean;
  /** After it has faded out and unmounted */
  onClosed?: () => void;
  style?: StyleProp<ViewStyle>;
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

export type PickerFieldSlot = 'label' | 'trigger' | 'triggerText' | 'placeholder' | 'chevron' | 'clear' | 'helperText';

/** A field's error: a message shown under it, or `true` to mark it invalid without one. */
export type FieldError = string | boolean;

/** A field's validation state, set from your form: the field shows it, it doesn't check the value. */
export interface FieldStatusProps {
  /** Shows the field as invalid, with the message under it when it's a string */
  error?: FieldError;
  /** Shown under the field, replaced by the `error` message */
  helperText?: string;
  /** Marks the label with an asterisk and tells screen readers the field is required */
  required?: boolean;
}

export interface PickerFieldTriggerInfo {
  /** With the `inline` presentation, a second call collapses the picker */
  open: () => void;
  displayValue: string;
  disabled: boolean;
  /** The field's `error`, to show your trigger as invalid */
  error?: FieldError;
}

/** The props every `*PickerField` shares; `styles` also reaches the picker inside the sheet, so it takes the picker's slots `S` too. */
export interface PickerFieldBaseProps<S extends string = never> extends ThemableProps, FieldStatusProps {
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
  /**
   * Where the picker opens: `dropdown` under the field, `bottomSheet`, `modal`, `inline`: expanded in place under the field, committing each
   * change (no Cancel / Done) and collapsing on a second tap, or `auto`: a dropdown on the web, a bottom sheet on native. Default: 'auto'
   */
  presentation?: FieldPresentation;
  style?: StyleProp<ViewStyle>;
  styles?: SlotStyles<PickerFieldSlot | S>;
  /** On the default trigger */
  testID?: string;
}

export interface PickerFieldProps extends PickerFieldBaseProps {
  /** Shown before the value, such as a colour swatch or a flag */
  icon?: React.ReactNode;
  /** Render the sheet the field opens, passing it `visible` and `onClose` */
  children: (sheet: Pick<SheetChromeProps, 'visible' | 'onClose'>) => React.ReactNode;
}

/** A sheet's props turned into a field's: no `visible`, and the field props in place of the picker's own `style`, `testID`... */
export type WithPickerField<SheetProps, S extends string> = DistributiveOmit<SheetProps, 'visible' | keyof PickerFieldBaseProps> &
  PickerFieldBaseProps<S>;

export interface FieldLabelProps {
  label: string;
  invalid?: boolean;
  required?: boolean;
  theme: PickerTheme;
  style?: StyleProp<TextStyle>;
}

export interface FieldTriggerProps extends Omit<FieldStatusProps, 'helperText'> {
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

export interface FloatingLabelProps {
  label: string;
  /** On the border, small; otherwise resting inside the empty field */
  raised: boolean;
  open: boolean;
  invalid?: boolean;
  required?: boolean;
  borderWidth: number;
  theme: PickerTheme;
  style?: StyleProp<TextStyle>;
}

export interface FieldFrameProps extends FieldStatusProps {
  label?: string;
  /** The message centered under the box, for content centered in its row */
  centered?: boolean;
  theme: PickerTheme;
  slots?: SlotStyles<'label' | 'helperText'>;
  /** The field's box */
  children: React.ReactNode;
}

export interface FieldMessageProps extends Omit<FieldStatusProps, 'required'> {
  /** Under content centered in its row, such as a code's boxes, rather than a field's text */
  centered?: boolean;
  theme: PickerTheme;
  style?: StyleProp<TextStyle>;
}

export interface FieldAccessibilityOptions extends Omit<FieldStatusProps, 'helperText'> {
  /** What the field is called: its label, or the placeholder without one */
  name: string;
  value?: string;
}
