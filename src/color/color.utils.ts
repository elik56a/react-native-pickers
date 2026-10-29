import { IS_WEB } from '../core/core.constants';
import { clamp01 } from '../core/utils/track.utils';
import {
  CHECK_ON_DARK,
  CHECK_ON_LIGHT,
  DEFAULT_COLOR_LABELS,
  IOS_GRID_COLUMNS,
  IOS_GRID_HUE_START,
  IOS_GRID_SHADES,
  LIGHT_LUMINANCE,
} from './color.constants';
import type { ColorLabels, ColorOption, Hsv, SwatchCell } from './color.types';

const HEX = /^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const OPAQUE = 'FF';

/**
 * '#RRGGBB' in capitals for a 3- or 6-digit code with or without '#', or '#RRGGBBAA' for a 4- or 8-digit one below full
 * opacity; null for anything else.
 */
export const normalizeHex = (input: string) => {
  const digits = HEX.exec(input.trim())?.[1];
  if (!digits) return null;
  const full = (digits.length <= 4 ? Array.from(digits, (d) => d + d).join('') : digits).toUpperCase();
  return `#${full.endsWith(OPAQUE) && full.length === 8 ? full.slice(0, 6) : full}`;
};

const toHexByte = (n: number) =>
  Math.round(clamp01(n) * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase();

/** The colour without its opacity, and the opacity 0–1. */
export const splitAlpha = (hex: string) => {
  const full = normalizeHex(hex) ?? '#000000';
  return {
    rgb: full.slice(0, 7),
    alpha: full.length === 9 ? Number.parseInt(full.slice(7), 16) / 255 : 1,
  };
};

/** '#RRGGBB' at full opacity, '#RRGGBBAA' below it. */
export const withAlpha = (rgb: string, alpha: number) => (alpha >= 1 ? rgb : `${rgb}${toHexByte(alpha)}`);

/** Red, green and blue, each 0–1. */
export const hexToRgb = (hex: string) => {
  const n = Number.parseInt(splitAlpha(hex).rgb.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => c / 255) as [number, number, number];
};

export const rgbToHex = ([r, g, b]: [number, number, number]) => `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`;

export const hexToHsv = (hex: string): Hsv => {
  const [r, g, b] = hexToRgb(hex);
  const max = Math.max(r, g, b);
  const delta = max - Math.min(r, g, b);
  let hue = 0;
  if (delta) {
    if (max === r) hue = ((g - b) / delta + 6) % 6;
    else if (max === g) hue = (b - r) / delta + 2;
    else hue = (r - g) / delta + 4;
  }
  return {
    hue: hue / 6,
    saturation: max ? delta / max : 0,
    brightness: max,
  };
};

export const hsvToHex = ({ hue, saturation, brightness }: Hsv) => {
  const channel = (n: number) => {
    const k = (n + hue * 6) % 6;
    return brightness - brightness * saturation * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return rgbToHex([channel(5), channel(3), channel(1)]);
};

/** The hue at full colour, for the pad's base and the hue slider's thumb. */
export const pureHue = (hue: number) => hsvToHex({ hue, saturation: 1, brightness: 1 });

/** `count` steps from 0 to 1. */
export const steps01 = (count: number) => Array.from({ length: count }, (_, i) => i / (count - 1));

export const getHueTrack = (count: number) => steps01(count).map(pureHue);

/** Slices of a gradient, keyed by where they sit. */
export const toSlices = (colors: string[]) =>
  colors.map((color, i) => ({
    key: String(i / colors.length),
    color,
  }));

/** Opacities from `from` to `to`, keyed by where they sit: the white and black fades over a pad. */
export const getFade = (count: number, from: number, to: number) =>
  steps01(count).map((t) => ({
    key: String(t),
    opacity: from + (to - from) * t,
  }));

/** One of red, green or blue from 0 to 1, the other two as they are. */
export const getRgbTrack = (rgb: string, channel: 0 | 1 | 2, count: number) => {
  const base = hexToRgb(rgb);
  return steps01(count).map((t) => rgbToHex(base.map((c, i) => (i === channel ? t : c)) as [number, number, number]));
};

/** The colour from clear to solid. */
export const getAlphaTrack = (rgb: string, count: number) => steps01(count).map((t) => `${rgb}${toHexByte(t)}`);

/** iOS's spectrum: hue across; down from white through the full colour to black. */
export const spectrumToHsv = (x: number, y: number): Hsv =>
  y < 0.5 ? { hue: x, saturation: y * 2, brightness: 1 } : { hue: x, saturation: 1, brightness: 1 - (y - 0.5) * 2 };

/** Where a colour sits on iOS's spectrum: tints above the middle, shades below. */
export const hsvToSpectrum = ({ hue, saturation, brightness }: Hsv) => ({
  x: hue,
  y: brightness >= 1 ? saturation / 2 : 0.5 + (1 - brightness) / 2,
});

/** iOS's grid: a row of greys from white to black, then each hue from dark shades to pale tints. */
export const getIosGridColors = () => [
  steps01(IOS_GRID_COLUMNS).map((t) => hsvToHex({ hue: 0, saturation: 0, brightness: 1 - t })),
  ...IOS_GRID_SHADES.map((shade) =>
    Array.from({ length: IOS_GRID_COLUMNS }, (_, c) => hsvToHex({ hue: (IOS_GRID_HUE_START + c / IOS_GRID_COLUMNS) % 1, ...shade }))
  ),
];

/** WCAG relative luminance, 0 (black) to 1 (white). */
export const getLuminance = (hex: string) => {
  const [r, g, b] = hexToRgb(hex).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** A check mark that shows on the colour: dark on light colours, light on dark ones. */
export const getCheckColor = (hex: string) => (getLuminance(hex) > LIGHT_LUMINANCE ? CHECK_ON_LIGHT : CHECK_ON_DARK);

export const normalizeOption = (option: ColorOption) => {
  const { value, label } = typeof option === 'string' ? { value: option, label: undefined } : option;
  const hex = normalizeHex(value) ?? value;
  return {
    value: hex,
    label: label ?? hex,
  };
};

export const isSwatch = (colors: ColorOption[], color: string) => colors.some((option) => normalizeOption(option).value === color);

export const toSwatchCells = (colors: ColorOption[]): SwatchCell[] =>
  colors.map(normalizeOption).map((cell) => ({
    key: cell.value,
    ...cell,
  }));

export const percent = (value: number) => `${Math.round(value * 100)}%`;

export const degrees = (value: number) => `${Math.round(value * 360)}°`;

export const resolveColorLabels = (labels?: Partial<ColorLabels>): ColorLabels => {
  const resolved = { ...DEFAULT_COLOR_LABELS };
  for (const key of Object.keys(resolved) as (keyof ColorLabels)[]) resolved[key] = labels?.[key] ?? resolved[key];
  return resolved;
};

/** The browser's clipboard where there is one; native apps pass their own `onCopy`. */
export const getDefaultCopy = (): ((hex: string) => unknown) | null => {
  const clipboard = (globalThis as { navigator?: { clipboard?: { writeText: (text: string) => Promise<void> } } }).navigator?.clipboard;
  return IS_WEB && clipboard ? (hex) => clipboard.writeText(hex) : null;
};

interface EyeDropperApi {
  open: () => Promise<{ sRGBHex: string }>;
}

/** The browser's eyedropper (Chromium), or null where there's none. */
export const getEyeDropper = (): (() => Promise<string>) | null => {
  const EyeDropper = (globalThis as { EyeDropper?: new () => EyeDropperApi }).EyeDropper;
  return IS_WEB && EyeDropper ? async () => (await new EyeDropper().open()).sRGBHex : null;
};
