import { createContext, useContext, useMemo } from 'react';
import { Platform, type PlatformOSType, useColorScheme } from 'react-native';

import type { DeepPartial } from '../core.types';
import { COLOR_SCHEME, DESIGN, DESIGN_TOKENS, darkTheme, lightTheme } from './theme.constants';
import type { ColorScheme, Design, DesignPreference, PickersProviderProps, PickerTheme } from './theme.types';
import { mergeTheme, resolveDesign } from './theme.utils';

interface ThemeContextValue {
  theme?: DeepPartial<PickerTheme>;
  darkTheme?: DeepPartial<PickerTheme>;
  colorScheme: ColorScheme;
  platform?: PlatformOSType;
  design: DesignPreference;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const PickersProvider = ({
  children,
  colorScheme = COLOR_SCHEME.auto,
  theme,
  darkTheme: dark,
  platform,
  design = DESIGN.auto,
}: PickersProviderProps) => {
  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      darkTheme: dark,
      colorScheme,
      platform,
      design,
    }),
    [theme, dark, colorScheme, platform, design]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/** The platform pickers behave as on: the provider's `platform`, or the one they run on. */
export const usePickerPlatform = (): PlatformOSType => useContext(ThemeContext)?.platform ?? Platform.OS;

/**
 * Resolves the active theme: the design's tokens on the light or dark theme, then the provider's overrides, then the component's.
 * The design comes from the component override, the provider, or the platform.
 */
export const usePickerTheme = (override?: DeepPartial<PickerTheme>): PickerTheme => {
  const ctx = useContext(ThemeContext);
  const system = useColorScheme();
  const platform = usePickerPlatform();
  const scheme = ctx?.colorScheme ?? COLOR_SCHEME.auto;
  const isDark = scheme === COLOR_SCHEME.auto ? system === COLOR_SCHEME.dark : scheme === COLOR_SCHEME.dark;
  const provided = isDark ? (ctx?.darkTheme ?? ctx?.theme) : ctx?.theme;
  const design = override?.design ?? provided?.design ?? resolveDesign(ctx?.design ?? DESIGN.auto, platform);
  const base = useMemo(
    () => mergeTheme(mergeTheme(isDark ? darkTheme : lightTheme, DESIGN_TOKENS[design]), provided),
    [isDark, design, provided]
  );
  return useMemo(() => mergeTheme(base, override), [base, override]);
};

/** Folds a component's `design` prop into its `theme` override, so every part it passes the override to draws the same design. */
export const useDesignOverride = (theme: DeepPartial<PickerTheme> | undefined, design: Design | undefined) =>
  useMemo(() => (design ? { ...theme, design } : theme), [theme, design]);
