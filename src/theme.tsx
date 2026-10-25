import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import type { TextStyle } from 'react-native';

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

const shared = {
  radius: { sm: 8, md: 12, lg: 16, full: 999, sheet: 24 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
  typography: {
    sizes: { xs: 11, sm: 13, md: 16, lg: 19, xl: 22 },
    weights: { regular: '400', medium: '500', bold: '600' } as PickerTheme['typography']['weights'],
  },
  animation: { duration: 240 },
};

export const lightTheme: PickerTheme = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#F2F3F7',
    sheet: '#FFFFFF',
    text: '#14151A',
    textSecondary: '#6B6F7B',
    textDisabled: '#B9BCC6',
    primary: '#4F46E5',
    onPrimary: '#FFFFFF',
    primaryMuted: 'rgba(79,70,229,0.12)',
    border: '#E6E7EC',
    backdrop: 'rgba(10,11,16,0.45)',
    indicator: 'rgba(20,21,26,0.06)',
    handle: '#D5D7DE',
  },
  ...shared,
};

export const darkTheme: PickerTheme = {
  dark: true,
  colors: {
    background: '#16171C',
    surface: '#22242B',
    sheet: '#1B1C22',
    text: '#F3F4F7',
    textSecondary: '#9A9EAA',
    textDisabled: '#4E515B',
    primary: '#8B85FF',
    onPrimary: '#0E0E14',
    primaryMuted: 'rgba(139,133,255,0.18)',
    border: '#2C2E36',
    backdrop: 'rgba(0,0,0,0.6)',
    indicator: 'rgba(255,255,255,0.07)',
    handle: '#3A3D47',
  },
  ...shared,
};

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? (T[K] extends Function ? T[K] : DeepPartial<T[K]>) : T[K];
};

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function mergeTheme<T>(base: T, override?: DeepPartial<T>): T {
  if (!override) return base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const key of Object.keys(override)) {
    const o = (override as Record<string, unknown>)[key];
    const b = out[key];
    out[key] = isPlainObject(o) && isPlainObject(b) ? mergeTheme(b, o as DeepPartial<typeof b>) : o;
  }
  return out as T;
}

/** Build a full theme from overrides on top of the light (or dark) base. */
export function createTheme(overrides: DeepPartial<PickerTheme>, base?: PickerTheme): PickerTheme {
  return mergeTheme(base ?? (overrides.dark ? darkTheme : lightTheme), overrides);
}

interface ProviderValue {
  light: PickerTheme;
  dark: PickerTheme;
  colorScheme: 'auto' | 'light' | 'dark';
}

const ThemeContext = createContext<ProviderValue | null>(null);

export interface PickersProviderProps {
  children: React.ReactNode;
  /** 'auto' follows the OS appearance. Default: 'auto' */
  colorScheme?: 'auto' | 'light' | 'dark';
  /** Overrides applied to the light theme (or a full theme) */
  theme?: DeepPartial<PickerTheme>;
  /** Overrides applied to the dark theme */
  darkTheme?: DeepPartial<PickerTheme>;
}

export function PickersProvider({ children, colorScheme = 'auto', theme, darkTheme: dark }: PickersProviderProps) {
  const value = useMemo<ProviderValue>(
    () => ({
      light: mergeTheme(lightTheme, theme),
      dark: mergeTheme(darkTheme, dark ?? theme),
      colorScheme,
    }),
    [theme, dark, colorScheme]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Resolves the active theme, applying a component-level override if given. */
export function usePickerTheme(override?: DeepPartial<PickerTheme>): PickerTheme {
  const ctx = useContext(ThemeContext);
  const system = useColorScheme();
  const scheme = ctx?.colorScheme ?? 'auto';
  const isDark = scheme === 'auto' ? system === 'dark' : scheme === 'dark';
  const base = isDark ? ctx?.dark ?? darkTheme : ctx?.light ?? lightTheme;
  return useMemo(() => mergeTheme(base, override), [base, override]);
}

/** Text style helper used across components. */
export function textStyle(theme: PickerTheme, size: keyof PickerTheme['typography']['sizes'], weight: 'regular' | 'medium' | 'bold' = 'regular'): TextStyle {
  return {
    fontSize: theme.typography.sizes[size],
    fontWeight: theme.typography.weights[weight],
    fontFamily: weight === 'regular' ? theme.typography.fontFamily : theme.typography.fontFamilyMedium ?? theme.typography.fontFamily,
    color: theme.colors.text,
  };
}
