import type { StyleProp, ViewStyle } from 'react-native';

import type { SlotStyles, ThemableProps } from '../core';
import type { ValueOf } from '../core/core.types';
import type { PickerTheme } from '../core/theme/theme.types';
import type { SheetChromeProps, WithPickerField } from '../sheet';
import type { TimeBounds, TimeDisplay, TimePanelColumn } from '../time/time.types';
import type { MultiWheelSlot, WheelColumn, WheelVariant } from '../wheel/wheel.types';
import type { DURATION_UNIT } from './duration.constants';

export type DurationUnit = ValueOf<typeof DURATION_UNIT>;

export type DurationLabels = Record<DurationUnit, string>;

/** Wheels, number boxes to type into, or columns of cells to click. */
export type DurationDisplay = Exclude<TimeDisplay, 'dial'>;

export interface DurationPickerProps extends ThemableProps {
  /** Selected duration, in seconds. */
  value?: number;
  defaultValue?: number;
  onChange?: (seconds: number) => void;
  /** Fires on every tick while scrolling (for haptics). */
  onValueChanging?: (seconds: number) => void;
  /** Wheels, boxes to type the numbers into, or columns of cells to click. Default: wheels on iOS, boxes in Material, the columns on the web */
  display?: DurationDisplay;
  /** Show an hours wheel. Without it, minutes count past 59. Default: true */
  showHours?: boolean;
  /** Show a seconds wheel. Default: false */
  showSeconds?: boolean;
  /** Shortest selectable duration, in seconds. Default: 0 */
  min?: number;
  /** Longest selectable duration, in seconds. Default: 23 h 59 min 59 s, or 59 min 59 s without hours */
  max?: number;
  /** Minute step: 1, 5, 15... Default: 1 */
  minuteInterval?: number;
  /** Second step. Default: 1 */
  secondInterval?: number;
  /** Unit names beside the wheels and in the field. Default: `{ hours: 'h', minutes: 'min', seconds: 's' }` */
  labels?: Partial<DurationLabels>;
  /** Infinite minute and second wheels. Default: true */
  loop?: boolean;
  itemHeight?: number;
  visibleItems?: number;
  variant?: WheelVariant;
  style?: StyleProp<ViewStyle>;
  styles?: SlotStyles<MultiWheelSlot>;
  testID?: string;
}

/** The DurationPicker props that shape its wheels and its text. */
export type DurationOptions = Pick<
  DurationPickerProps,
  'showHours' | 'showSeconds' | 'min' | 'max' | 'minuteInterval' | 'secondInterval' | 'labels'
>;

export interface ResolvedDurationOptions {
  showHours: boolean;
  showSeconds: boolean;
  minuteInterval: number;
  secondInterval: number;
  bounds: TimeBounds;
  labels: DurationLabels;
}

export type DurationColumnsOptions = DurationOptions &
  Pick<DurationPickerProps, 'onValueChanging' | 'loop' | 'testID'> & {
    value: number;
    onChange: (seconds: number) => void;
  };

export interface DurationInputProps {
  columns: TimePanelColumn[];
  theme: PickerTheme;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export type DurationPickerSheetProps = SheetChromeProps &
  Omit<DurationPickerProps, 'value' | 'defaultValue' | 'onChange' | 'theme'> & {
    value?: number;
    onConfirm: (seconds: number) => void;
  };

export type DurationPickerFieldProps = WithPickerField<DurationPickerSheetProps, MultiWheelSlot>;

export type DurationParts = Record<DurationUnit, number>;

/** A duration wheel column before its change handlers are attached; `toPatch` maps a wheel value to the parts it sets. */
export type DurationColumnSpec = Omit<WheelColumn<number>, 'onChange' | 'onValueChanging' | 'key'> & {
  key: DurationUnit;
  toPatch: (value: number) => Partial<DurationParts>;
};
