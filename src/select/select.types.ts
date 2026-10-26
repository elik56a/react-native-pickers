import type React from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import type { PickerTheme, SlotStyles, ThemableProps } from '../core';
import type { ChevronInfo, PickerFieldSlot, SheetChromeProps, SheetPresentation } from '../sheet';
import type { FieldTriggerProps } from '../sheet/sheet.types';

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
export type SelectPresentation = SheetPresentation | 'dropdown';

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
  | 'emptyText';

export interface SelectRenderOptionInfo<T> {
  option: SelectOption<T>;
  selected: boolean;
  disabled: boolean;
  theme: PickerTheme;
}

/** Blocks inference from `onChange`, so `onChange={setState}` doesn't infer `T` as `SetStateAction<…>`. Works before TS 5.4's built-in NoInfer. */
type NoInferValue<T> = [T][T extends unknown ? 0 : never];

export type SelectValueProps<T> =
  | { multiple?: false; value?: T | null; onChange?: (value: NoInferValue<T>, option: SelectOption<T>) => void }
  | { multiple: true; value?: T[]; onChange?: (value: NoInferValue<T>[], options: SelectOption<T>[]) => void; maxSelected?: number };

export type SelectListBaseProps<T> = ThemableProps & {
  options: ReadonlyArray<SelectOption<T>>;
  /** Show a search field. Default: true when there are more than 8 options */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Controlled search query, for filtering from your own input. Hides the built-in search field */
  query?: string;
  /** Custom filter. Default: case/diacritics-insensitive match on label, description and keywords */
  filterOption?: (option: SelectOption<T>, query: string) => boolean;
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
}

export type SelectPickerProps<T> = Omit<SelectListBaseProps<T>, 'style' | 'styles'> &
  SelectValueProps<T> & {
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
    /** Bottom sheet, centered modal, or a dropdown under the field. Default: 'auto' (dropdown on the web, bottom sheet on native). As a dropdown, `searchable` (default: true) lets the user type in the field itself */
    presentation?: SelectPresentation;
    sheet?: Partial<Omit<SheetChromeProps, 'visible' | 'onClose' | 'theme' | 'presentation'>>;
    onOpen?: () => void;
    onClose?: () => void;
    style?: StyleProp<ViewStyle>;
    styles?: SlotStyles<SelectSlot | SelectTriggerSlot>;
  };

export type SelectRow<T> = { type: 'header'; group: string } | { type: 'option'; option: SelectOption<T> };

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

export interface CheckProps {
  selected: boolean;
  multiple: boolean;
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
