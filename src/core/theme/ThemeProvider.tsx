import { createContext, useContext, useMemo } from 'react';
import { Platform, type PlatformOSType, useColorScheme } from 'react-native';

import type { DeepPartial } from '../core.types';
import { COLOR_SCHEME, darkTheme, lightTheme } from './theme.constants';
import type { ColorScheme, PickersProviderProps, PickerTheme } from './theme.types';
import { mergeTheme } from './theme.utils';

interface ThemeContextValue {
  light: PickerTheme;
  dark: PickerTheme;
  colorScheme: ColorScheme;
  platform?: PlatformOSType;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const PickersProvider = ({ children, colorScheme = COLOR_SCHEME.auto, theme, darkTheme: dark, platform }: PickersProviderProps) => {
  const value = useMemo<ThemeContextValue>(
    () => ({
      light: mergeTheme(lightTheme, theme),
      dark: mergeTheme(darkTheme, dark ?? theme),
      colorScheme,
      platform,
    }),
    [theme, dark, colorScheme, platform]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/** Resolves the active theme, applying a component-level override if given. */
export const usePickerTheme = (override?: DeepPartial<PickerTheme>): PickerTheme => {
  const ctx = useContext(ThemeContext);
  const system = useColorScheme();
  const scheme = ctx?.colorScheme ?? COLOR_SCHEME.auto;
  const isDark = scheme === COLOR_SCHEME.auto ? system === COLOR_SCHEME.dark : scheme === COLOR_SCHEME.dark;
  const base = isDark ? (ctx?.dark ?? darkTheme) : (ctx?.light ?? lightTheme);
  return useMemo(() => mergeTheme(base, override), [base, override]);
};

/** The platform pickers behave as on: the provider's `platform`, or the one they run on. */
export const usePickerPlatform = (): PlatformOSType => useContext(ThemeContext)?.platform ?? Platform.OS;
