import type React from 'react';
import type { TextStyle } from 'react-native';
import type { DeepPartial } from '../core.types';

export interface PickerTheme {
  dark: boolean;
  colors: {
    /** Picker surface background */
    background: string;
    /** Secondary surfaces: search inputs, chips, hovered rows */
    surface: string;
    /** Bottom sheet background */
    sheet: string;
    text: string;
    textSecondary: string;
    textDisabled: string;
    primary: string;
    onPrimary: string;
    /** Soft primary tint: range fill, selected row background */
    primaryMuted: string;
    border: string;
    backdrop: string;
    /** Wheel selection band */
    indicator: string;
    handle: string;
  };
  radius: { sm: number; md: number; lg: number; full: number; sheet: number };
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number };
  typography: {
    fontFamily?: string;
    fontFamilyMedium?: string;
    sizes: { xs: number; sm: number; md: number; lg: number; xl: number };
    weights: { regular: TextStyle['fontWeight']; medium: TextStyle['fontWeight']; bold: TextStyle['fontWeight'] };
  };
  animation: { duration: number };
}

export type ColorScheme = 'auto' | 'light' | 'dark';
export type TextSize = keyof PickerTheme['typography']['sizes'];
export type TextWeight = keyof PickerTheme['typography']['weights'];

export interface PickersProviderProps {
  children: React.ReactNode;
  /** 'auto' follows the OS appearance. Default: 'auto' */
  colorScheme?: ColorScheme;
  /** Overrides applied to the light theme (or a full theme) */
  theme?: DeepPartial<PickerTheme>;
  /** Overrides applied to the dark theme */
  darkTheme?: DeepPartial<PickerTheme>;
}
