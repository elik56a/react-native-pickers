import type { PlatformOSType, TextStyle } from 'react-native';

import { PLATFORM } from '../core.constants';
import type { DeepPartial } from '../core.types';
import { DESIGN, darkTheme, lightTheme } from './theme.constants';
import type { Design, DesignPreference, PickerTheme, TextSize, TextWeight } from './theme.types';

const isPlainObject = (v: unknown): v is Record<string, unknown> => {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
};

export const mergeTheme = <T>(base: T, override?: DeepPartial<T>): T => {
  if (!override) return base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const key of Object.keys(override)) {
    const o = (override as Record<string, unknown>)[key];
    const b = out[key];
    out[key] = isPlainObject(o) && isPlainObject(b) ? mergeTheme(b, o as DeepPartial<typeof b>) : o;
  }
  return out as T;
};

/** Build a full theme from overrides on top of the light (or dark) base. */
export const createTheme = (overrides: DeepPartial<PickerTheme>, base?: PickerTheme): PickerTheme => {
  return mergeTheme(base ?? (overrides.dark ? darkTheme : lightTheme), overrides);
};

/** Text style helper used across components. */
export const textStyle = (theme: PickerTheme, size: TextSize, weight: TextWeight = 'regular'): TextStyle => {
  return {
    fontSize: theme.typography.sizes[size],
    fontWeight: theme.typography.weights[weight],
    fontFamily: weight === 'regular' ? theme.typography.fontFamily : (theme.typography.fontFamilyMedium ?? theme.typography.fontFamily),
    color: theme.colors.text,
  };
};

/** The design to draw: the one chosen, or for 'auto' the one that matches the platform. */
export const resolveDesign = (preference: DesignPreference, platform: PlatformOSType): Design => {
  if (preference !== DESIGN.auto) return preference;
  if (platform === PLATFORM.ios) return DESIGN.ios;
  return platform === PLATFORM.web ? DESIGN.web : DESIGN.material;
};
