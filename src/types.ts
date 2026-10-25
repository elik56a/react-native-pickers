import type { StyleProp, TextStyle } from 'react-native';
import type { DeepPartial, PickerTheme } from './theme';

/** Per-slot style overrides. Every component exposes its own slot names. */
export type SlotStyles<K extends string> = Partial<Record<K, StyleProp<TextStyle>>>;

export interface ThemableProps {
  /** Component-level theme override, merged on top of the provider theme */
  theme?: DeepPartial<PickerTheme>;
}
