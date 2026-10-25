import { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';

import type { DeepPartial } from '../core.types';
import { darkTheme, lightTheme } from './theme.constants';
import type { ColorScheme, PickersProviderProps, PickerTheme } from './theme.types';
import { mergeTheme } from './theme.utils';

interface ThemeContextValue {
  light: PickerTheme;
  dark: PickerTheme;
  colorScheme: ColorScheme;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const PickersProvider = ({ children, colorScheme = 'auto', theme, darkTheme: dark }: PickersProviderProps) => {
  const value = useMemo<ThemeContextValue>(
    () => ({
      light: mergeTheme(lightTheme, theme),
      dark: mergeTheme(darkTheme, dark ?? theme),
      colorScheme,
    }),
    [theme, dark, colorScheme]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/** Resolves the active theme, applying a component-level override if given. */
export const usePickerTheme = (override?: DeepPartial<PickerTheme>): PickerTheme => {
  const ctx = useContext(ThemeContext);
  const system = useColorScheme();
  const scheme = ctx?.colorScheme ?? 'auto';
  const isDark = scheme === 'auto' ? system === 'dark' : scheme === 'dark';
  const base = isDark ? (ctx?.dark ?? darkTheme) : (ctx?.light ?? lightTheme);
  return useMemo(() => mergeTheme(base, override), [base, override]);
};
