import type React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { PickerTheme, SlotStyles, ThemableProps } from '../core';
import type { ValueOf } from '../core/core.types';
import type { SheetChromeProps, WithPickerField } from '../sheet';
import type { COLOR_DISPLAY, COLOR_TAB } from './color.constants';

/** A swatch: a hex colour, or one with a name for screen readers. */
export type ColorOption = string | { value: string; label?: string };

export type ColorDisplay = ValueOf<typeof COLOR_DISPLAY>;

export type ColorTab = ValueOf<typeof COLOR_TAB>;

/** Hue, saturation and brightness, each 0–1. */
export interface Hsv {
  hue: number;
  saturation: number;
  brightness: number;
}

export type ColorLabels = Record<
  ColorTab | keyof Hsv | 'opacity' | 'red' | 'green' | 'blue' | 'hex' | 'copy' | 'copied' | 'eyedropper' | 'custom',
  string
>;

export type ColorPickerSlot = 'container' | 'swatch' | 'pad' | 'slider' | 'sliderThumb' | 'sliderLabel' | 'hexInput' | 'preview';

export interface ColorDesign {
  swatchShape: 'circle' | 'square';
  swatchSize: number;
  trackHeight: number;
  padHeight: number;
}

export interface ColorPickerProps extends ThemableProps {
  /** Selected colour, as hex: '#E4572E', or '#E4572E80' with opacity. */
  value?: string;
  defaultValue?: string;
  /** Fires with the colour as '#RRGGBB' ('#RRGGBBAA' below full opacity) on a tap, a slider or pad move, or a typed code. */
  onChange?: (color: string) => void;
  /** iOS's tabs, Google's circles with a Custom one, or the browser's spectrum. Default: from the design */
  display?: ColorDisplay;
  /** Your swatches. Default: 24 colours, named for screen readers */
  colors?: ColorOption[];
  /** The grid, spectrum, sliders and hex field, for any colour. Without them only `colors` show. Default: true */
  showCustom?: boolean;
  /** An opacity slider; the value gains two hex digits below full opacity. Default: false */
  showAlpha?: boolean;
  /** Copy the hex code: shown as a button in the hex field. Default: the browser's clipboard on the web, none on native */
  onCopy?: (hex: string) => unknown;
  /** Names of the tabs, sliders and buttons, also read by screen readers. Default: English */
  labels?: Partial<ColorLabels>;
  style?: StyleProp<ViewStyle>;
  styles?: SlotStyles<ColorPickerSlot>;
  testID?: string;
}

/** What every layout gets: the colour, its setters and the resolved options. */
export interface ColorLayoutProps {
  picker: ColorPickerState;
  colors: ColorOption[];
  showCustom: boolean;
  showAlpha: boolean;
  copy: ((hex: string) => unknown) | null;
  labels: ColorLabels;
  theme: PickerTheme;
  slots?: SlotStyles<ColorPickerSlot>;
  testID?: string;
}

export interface ColorPickerState {
  /** '#RRGGBB', or '#RRGGBBAA' below full opacity */
  value: string;
  /** '#RRGGBB', without opacity */
  rgb: string;
  hsv: Hsv;
  alpha: number;
  select: (color: string) => void;
  setHsv: (patch: Partial<Hsv>) => void;
  setAlpha: (alpha: number) => void;
}

export interface SwatchCell {
  key: string;
  value: string;
  label: string;
}

export interface SwatchGridProps {
  colors: ColorOption[];
  shape: ColorDesign['swatchShape'];
  size: number;
  /** One row to scroll sideways, as iOS shows saved colours, instead of rows that wrap */
  scroll?: boolean;
  selected: string;
  onSelect: (color: string) => void;
  /** A last circle that opens the custom colour, checked while the colour isn't a swatch */
  custom?: { open: boolean; label: string; onPress: () => void };
  theme: PickerTheme;
  slots?: SlotStyles<ColorPickerSlot>;
  testID?: string;
}

export interface ColorSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  /** The track's gradient, from 0 to 1 */
  colors: string[];
  thumbColor: string;
  /** What a screen reader reads, and iOS shows beside the slider */
  valueText: string;
  showLabel?: boolean;
  showValue?: boolean;
  /** A checkerboard behind the track, for opacity */
  checkered?: boolean;
  theme: PickerTheme;
  slots?: SlotStyles<ColorPickerSlot>;
  testID?: string;
}

export interface ColorPadProps {
  label: string;
  /** The thumb, 0–1 across and down */
  x: number;
  y: number;
  onChange: (x: number, y: number) => void;
  thumbColor: string;
  valueText: string;
  /** Names for the two directions a screen reader steps the second axis in */
  upLabel: string;
  downLabel: string;
  height: number;
  /** The pad's picture, drawn under the thumb */
  children: React.ReactNode;
  theme: PickerTheme;
  slots?: SlotStyles<ColorPickerSlot>;
  testID?: string;
}

export interface HexInputProps {
  value: string;
  rgb: string;
  label: string;
  onChange: (color: string) => void;
  copy: ((hex: string) => unknown) | null;
  copyLabel: string;
  copiedLabel: string;
  showPreview?: boolean;
  theme: PickerTheme;
  slots?: SlotStyles<ColorPickerSlot>;
  testID?: string;
}

export type ColorPickerSheetProps = SheetChromeProps &
  Omit<ColorPickerProps, 'value' | 'defaultValue' | 'onChange' | 'theme'> & {
    value?: string;
    onConfirm: (color: string) => void;
  };

export type ColorPickerFieldProps = WithPickerField<ColorPickerSheetProps, ColorPickerSlot>;
