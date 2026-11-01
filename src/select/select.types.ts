import type React from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import type { PickerTheme, SlotStyles, ThemableProps } from '../core';
import type { DistributiveOmit, NoInferValue, ValueOf } from '../core/core.types';
import type { ChevronInfo, FieldError, FieldStatusProps, PickerFieldSlot, SheetChromeProps } from '../sheet';
import type { FieldTriggerProps } from '../sheet/sheet.types';
import type { SELECT_PRESENTATION, SELECT_ROW_TYPE, SINGLE_INDICATOR } from './select.constants';

export interface SelectOption<T> {
  label: string;
  value: T;
  description?: string;
  disabled?: boolean;
  /** Leading element: icon, avatar, flag... */
  icon?: React.ReactNode;
  /** Options sharing a group are rendered under a section header */
  group?: string;
  /** Extra search terms */
  keywords?: string[];
}

/** A sheet presentation, or a dropdown under the field. */
export type SelectPresentation = ValueOf<typeof SELECT_PRESENTATION>;

export type SelectSlot =
  | 'container'
  | 'search'
  | 'searchInput'
  | 'list'
  | 'groupHeader'
  | 'groupHeaderText'
  | 'option'
  | 'selectedOption'
  | 'optionLabel'
  | 'selectedOptionLabel'
  | 'optionDescription'
  | 'check'
  | 'empty'
  | 'emptyText'
  | 'loading'
  | 'loadingText'
  | 'createOption'
  | 'createOptionLabel';

export interface SelectRenderOptionInfo<T> {
  option: SelectOption<T>;
  selected: boolean;
  disabled: boolean;
  theme: PickerTheme;
}

export type SelectValueProps<T> =
  | { multiple?: false; value?: T | null; onChange?: (value: NoInferValue<T>, option: SelectOption<T>) => void }
  | { multiple: true; value?: T[]; onChange?: (value: NoInferValue<T>[], options: SelectOption<T>[]) => void; maxSelected?: number };

export type SelectListBaseProps<T> = ThemableProps & {
  /** The options; with `loadOptions`, the ones shown before the user types. Default: [] */
  options?: ReadonlyArray<SelectOption<T>>;
  /** Show a search field. Default: true when there are more than 8 options */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Controlled search query, for filtering from your own input. Hides the built-in search field */
  query?: string;
  /** Custom filter. Default: case/diacritics-insensitive match on label, description and keywords; with `loadOptions` or `onSearchChange`, none (the server filters) */
  filterOption?: (option: SelectOption<T>, query: string) => boolean;
  /** Loads the options for what the user typed, e.g. from a server. The list shows the loader from the keystroke until they arrive, and ignores answers to older queries. An empty query shows `options` */
  loadOptions?: (query: string) => Promise<ReadonlyArray<SelectOption<T>>>;
  /** Called once the user pauses typing, to search yourself (set `loading` and `options`). Shows the search field even before any options arrive */
  onSearchChange?: (query: string) => void;
  /** ms to wait after the last keystroke before `loadOptions` / `onSearchChange`. Default: 300 */
  searchDebounce?: number;
  /**
   * Offers what the user typed as a new option, in a last row, when no option's label matches it. Return the new option to select it,
   * and add it to `options` so it stays in the list
   */
  // biome-ignore lint/suspicious/noConfusingVoidType: a handler that only adds the option, without selecting it, returns nothing.
  onCreate?: (text: string) => SelectOption<T> | void;
  /** The create row's text. Default: (text) => `Add "${text}"` */
  createLabel?: (text: string) => string;
  /** Called when the user scrolls near the end of the list, to load more options */
  onEndReached?: () => void;
  /** Show a loader: in place of the list while there are no options, under them otherwise */
  loading?: boolean;
  /** Shown in place of the list before the user types, while a searched list (`loadOptions` / `onSearchChange`) has no options. Default: 'Type to search' */
  searchPrompt?: string;
  /** Default: 'Loading…' */
  loadingText?: string;
  /** Custom loader, in place of the spinner and `loadingText` */
  renderLoading?: (theme: PickerTheme) => React.ReactNode;
  renderOption?: (info: SelectRenderOptionInfo<T>) => React.ReactNode;
  renderGroupHeader?: (group: string, theme: PickerTheme) => React.ReactNode;
  emptyText?: string;
  /** Show check marks on selected rows. Default: true */
  showCheckmarks?: boolean;
  isEqual?: (a: T, b: T) => boolean;
  /** Height of the list area. Default: grows with content */
  listHeight?: number;
  autoFocusSearch?: boolean;
  style?: StyleProp<ViewStyle>;
  styles?: SlotStyles<SelectSlot>;
  testID?: string;
};

export type SelectListProps<T> = SelectListBaseProps<T> & SelectValueProps<T>;

export type SelectTriggerSlot = PickerFieldSlot | 'chip' | 'chipText';

export type SelectChevronInfo = ChevronInfo;

export interface SelectTriggerInfo<T> {
  open: () => void;
  selected: SelectOption<T>[];
  disabled: boolean;
  /** The field's `error`, to show your trigger as invalid */
  error?: FieldError;
}

/** Server search props don't apply: the picker's list is built in. */
type ServerSearchProp =
  | 'options'
  | 'loadOptions'
  | 'onSearchChange'
  | 'searchDebounce'
  | 'onEndReached'
  | 'loading'
  | 'loadingText'
  | 'searchPrompt'
  | 'renderLoading'
  | 'isEqual';

/** A SelectPicker over a list built into the library, such as countries or languages. */
export type BuiltInSelectPickerProps<T> = DistributiveOmit<SelectPickerProps<T>, ServerSearchProp>;

export type SelectPickerProps<T> = Omit<SelectListBaseProps<T>, 'style' | 'styles' | 'query'> &
  SelectValueProps<T> &
  FieldStatusProps & {
    placeholder?: string;
    /** Label rendered above the field */
    label?: string;
    disabled?: boolean;
    /** Show a clear (×) button when something is selected */
    clearable?: boolean;
    onClear?: () => void;
    /** Show selected values as chips in multiple mode. Default: true */
    chips?: boolean;
    /** Single mode: close the sheet on select. Default: true */
    closeOnSelect?: boolean;
    /** Custom chevron icon; it still rotates as the field opens and closes */
    renderChevron?: (info: SelectChevronInfo) => React.ReactNode;
    /** Custom trigger: render anything and call `open()` */
    renderTrigger?: (info: SelectTriggerInfo<T>) => React.ReactNode;
    /** Sheet title. Default: `label` */
    sheetTitle?: string;
    /** Bottom sheet, centered modal, or a dropdown under the field. Default: 'auto' (dropdown on the web, bottom sheet on native). As a dropdown, `searchable` (default: true) lets the user type in the field itself, or in a search field atop the list with `renderTrigger` */
    presentation?: SelectPresentation;
    sheet?: Partial<Omit<SheetChromeProps, 'visible' | 'onClose' | 'theme' | 'presentation'>>;
    onOpen?: () => void;
    onClose?: () => void;
    style?: StyleProp<ViewStyle>;
    styles?: SlotStyles<SelectSlot | SelectTriggerSlot>;
  };

export type SelectRow<T> =
  | { type: typeof SELECT_ROW_TYPE.header; group: string }
  | { type: typeof SELECT_ROW_TYPE.option; option: SelectOption<T> }
  | { type: typeof SELECT_ROW_TYPE.create; text: string };

export interface GroupHeaderProps {
  group: string;
  renderGroupHeader?: SelectListBaseProps<unknown>['renderGroupHeader'];
  theme: PickerTheme;
  slots?: SlotStyles<SelectSlot>;
}

export interface OptionRowProps<T> {
  option: SelectOption<T>;
  selected: boolean;
  disabled: boolean;
  multiple: boolean;
  showCheckmarks: boolean;
  renderOption?: (info: SelectRenderOptionInfo<T>) => React.ReactNode;
  onToggle: (option: SelectOption<T>) => void;
  theme: PickerTheme;
  slots?: SlotStyles<SelectSlot>;
}

export interface CreateRowProps {
  text: string;
  label: string;
  onCreate: (text: string) => void;
  theme: PickerTheme;
  slots?: SlotStyles<SelectSlot>;
}

export interface LoadingStateProps {
  text: string;
  renderLoading?: (theme: PickerTheme) => React.ReactNode;
  theme: PickerTheme;
  slots?: SlotStyles<SelectSlot>;
}

export interface SelectDesign {
  singleIndicator: ValueOf<typeof SINGLE_INDICATOR>;
  /** Rows as rounded blocks inset from the edges, or edge to edge */
  insetRows: boolean;
  /** Tint the chosen rows, on top of their check */
  tintSelected: boolean;
  rowHeight: number;
  checkbox: { size: number; radius: number; offColor: keyof PickerTheme['colors'] };
}

export interface CheckProps {
  selected: boolean;
  multiple: boolean;
  radio: boolean;
  theme: PickerTheme;
  style?: StyleProp<TextStyle>;
}

export type SelectTriggerProps<T> = Omit<FieldTriggerProps, 'displayValue' | 'icon' | 'children' | 'slots'> & {
  selected: SelectOption<T>[];
  multiple: boolean;
  chips: boolean;
  onRemove: (option: SelectOption<T>) => void;
  slots?: SlotStyles<SelectSlot | SelectTriggerSlot>;
};

export interface SelectSearchFieldProps {
  query: string;
  onChangeQuery: (query: string) => void;
  placeholder: string;
  renderChevron?: (info: SelectChevronInfo) => React.ReactNode;
  theme: PickerTheme;
  slots?: SlotStyles<SelectSlot | SelectTriggerSlot>;
}
