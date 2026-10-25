import type { StyleProp, TextStyle } from 'react-native';
import type { PickerTheme } from './theme/theme.types';

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends (...args: never[]) => unknown ? T[K] : T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/** Per-slot style overrides. Every component exposes its own slot names. */
export type SlotStyles<K extends string> = Partial<Record<K, StyleProp<TextStyle>>>;

export interface ThemableProps {
  /** Component-level theme override, merged on top of the provider theme */
  theme?: DeepPartial<PickerTheme>;
}

export interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  autoFocus?: boolean;
  theme: PickerTheme;
  style?: StyleProp<TextStyle>;
}
