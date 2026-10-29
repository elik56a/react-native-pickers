import type { Design } from '../core/theme/theme.types';
import type { ColorDesign, ColorDisplay, ColorLabels, ColorOption } from './color.types';

export const DEFAULT_COLOR = '#2196F3';

/** Material's palette, then greys, each named for screen readers. */
export const DEFAULT_COLORS: ColorOption[] = [
  { value: '#F44336', label: 'Red' },
  { value: '#E91E63', label: 'Pink' },
  { value: '#9C27B0', label: 'Purple' },
  { value: '#673AB7', label: 'Deep purple' },
  { value: '#3F51B5', label: 'Indigo' },
  { value: '#2196F3', label: 'Blue' },
  { value: '#03A9F4', label: 'Light blue' },
  { value: '#00BCD4', label: 'Cyan' },
  { value: '#009688', label: 'Teal' },
  { value: '#4CAF50', label: 'Green' },
  { value: '#8BC34A', label: 'Light green' },
  { value: '#CDDC39', label: 'Lime' },
  { value: '#FFEB3B', label: 'Yellow' },
  { value: '#FFC107', label: 'Amber' },
  { value: '#FF9800', label: 'Orange' },
  { value: '#FF5722', label: 'Deep orange' },
  { value: '#795548', label: 'Brown' },
  { value: '#607D8B', label: 'Blue grey' },
  { value: '#000000', label: 'Black' },
  { value: '#616161', label: 'Dark grey' },
  { value: '#9E9E9E', label: 'Grey' },
  { value: '#E0E0E0', label: 'Light grey' },
  { value: '#F5F5F5', label: 'Off-white' },
  { value: '#FFFFFF', label: 'White' },
];

export const COLOR_DISPLAY = {
  /** iOS's colour picker: Grid, Spectrum and Sliders tabs over an opacity slider and the colour beside your swatches */
  tabs: 'tabs',
  /** Google's apps: circles to tap, and a Custom circle that opens the square, hue and hex */
  swatches: 'swatches',
  /** The browser's colour input: the saturation square, hue and hex, then your swatches */
  spectrum: 'spectrum',
} as const;

export const COLOR_DISPLAY_DESIGN: Record<Design, ColorDisplay> = {
  ios: COLOR_DISPLAY.tabs,
  material: COLOR_DISPLAY.swatches,
  web: COLOR_DISPLAY.spectrum,
};

export const COLOR_TAB = {
  grid: 'grid',
  spectrum: 'spectrum',
  sliders: 'sliders',
} as const;

export const DEFAULT_COLOR_LABELS: ColorLabels = {
  grid: 'Grid',
  spectrum: 'Spectrum',
  sliders: 'Sliders',
  hue: 'Hue',
  saturation: 'Saturation',
  brightness: 'Brightness',
  opacity: 'Opacity',
  red: 'Red',
  green: 'Green',
  blue: 'Blue',
  hex: 'Hex',
  copy: 'Copy',
  copied: 'Copied',
  eyedropper: 'Pick a colour from the screen',
  custom: 'Custom colour',
};

/** Slices that draw a gradient without a gradient library; more than the eye tells apart at these sizes. */
export const SLIDER_SEGMENTS = 36;
export const PAD_SEGMENTS = 32;
/** How far a screen reader's step moves a slider or pad: 1/36 of the hue circle is 10°. */
export const COLOR_STEP = 1 / 36;
export const SLIDER_THUMB_SIZE = 28;
/** The slider's touch area, 44pt as iOS asks, however thin its track. */
export const SLIDER_HIT_HEIGHT = 44;
export const PAD_THUMB_SIZE = 22;
export const COLOR_A11Y_ACTIONS = [{ name: 'increment' }, { name: 'decrement' }];
/** The pad's second axis, for screen readers, which step one axis at a time. */
export const PAD_ACTION = { up: 'up', down: 'down' } as const;
export const COPIED_MS = 1500;
export const CHECKER_SIZE = 6;
export const CHECKER_COLUMNS = 80;

/** The thumb's ring and shadow, white on any colour as in the platforms' own colour sliders. */
export const THUMB_RING = '#FFFFFF';
export const THUMB_SHADOW = '0 1px 4px rgba(0, 0, 0, 0.3)';
export const PAD_WHITE = '#FFFFFF';
export const PAD_BLACK = '#000000';
export const CHECKER_LIGHT = '#FFFFFF';
export const CHECKER_DARK = '#D9D9D9';
export const SWATCH_CHECK = '✓';
export const CUSTOM_PLUS = '+';
/** The check on a swatch, dark on light colours and light on dark ones. */
export const CHECK_ON_LIGHT = '#17150F';
export const CHECK_ON_DARK = '#FFFFFF';
/** Above this relative luminance a colour counts as light. */
export const LIGHT_LUMINANCE = 0.45;
export const HEX_MAX_LENGTH = 9;

/** iOS's grid: 12 hues across, a row of greys over 9 rows from dark shades to pale tints. */
export const IOS_GRID_COLUMNS = 12;
export const IOS_GRID_HUE_START = 0.55;
export const IOS_GRID_SHADES: { saturation: number; brightness: number }[] = [
  { saturation: 1, brightness: 0.3 },
  { saturation: 1, brightness: 0.45 },
  { saturation: 1, brightness: 0.6 },
  { saturation: 1, brightness: 0.78 },
  { saturation: 1, brightness: 1 },
  { saturation: 0.75, brightness: 1 },
  { saturation: 0.55, brightness: 1 },
  { saturation: 0.36, brightness: 1 },
  { saturation: 0.18, brightness: 1 },
];

/** iOS's saved colours are small circles in a row; Google's are 40dp circles; the browser's are small squares. */
export const COLOR_DESIGN: Record<Design, ColorDesign> = {
  ios: { swatchShape: 'circle', swatchSize: 30, trackHeight: 28, padHeight: 200 },
  material: { swatchShape: 'circle', swatchSize: 40, trackHeight: 12, padHeight: 140 },
  web: { swatchShape: 'square', swatchSize: 22, trackHeight: 10, padHeight: 150 },
};

/** iOS's grid cells: as wide as the sheet allows, this tall, so the grid keeps its height on wide screens. */
export const IOS_GRID_CELL_HEIGHT = 24;
