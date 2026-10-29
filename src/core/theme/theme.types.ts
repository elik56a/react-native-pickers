import type React from 'react';
import type { PlatformOSType, TextStyle } from 'react-native';

import type { DeepPartial, ValueOf } from '../core.types';
import type { COLOR_SCHEME, DESIGN } from './theme.constants';

export interface PickerTheme {
  dark: boolean;
  /** The look pickers follow: 'ios', 'material' or 'web' */
  design: Design;
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
    /** Tint over anything pressable while the pointer is over it (web and pointer devices). 'transparent' turns it off */
    hover: string;
    /** The ripple that spreads from the touch point on press. 'transparent' turns it off */
    ripple: string;
    /** Destructive actions, such as Delete in an action sheet */
    danger: string;
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

export type ColorScheme = ValueOf<typeof COLOR_SCHEME>;
/** A design, or 'auto' for the one that matches the platform */
export type DesignPreference = ValueOf<typeof DESIGN>;
export type Design = Exclude<DesignPreference, typeof DESIGN.auto>;
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
  /** Pickers behave as on this platform: sheets or dropdowns, insets, dragging. For previewing iOS or Android in a browser. Default: `Platform.OS` */
  platform?: PlatformOSType;
  /** The look pickers follow. 'auto' matches the platform: 'ios' on iOS, 'web' on the web, 'material' elsewhere. Default: 'auto' */
  design?: DesignPreference;
}
