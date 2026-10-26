import type React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { Locale, SlotStyles, ThemableProps } from '../core';
import type { SheetChromeProps, WithPickerField } from '../sheet';
import type { MultiWheelSlot, WheelColumn, WheelVariant } from '../wheel/wheel.types';

export type TimeFormat = '12h' | '24h' | 'auto';

export interface TimePickerProps extends ThemableProps {
  /** Selected time (the date part is preserved). */
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  /** Fires on every tick while scrolling (for haptics). */
  onValueChanging?: (date: Date) => void;
  /** Default: 'auto' (from locale) */
  format?: TimeFormat;
  locale?: Locale;
  /** Minute step: 1, 5, 15... Default: 1 */
  minuteInterval?: number;
  showSeconds?: boolean;
  secondInterval?: number;
  /** Earliest selectable time of day */
  minTime?: Date;
  /** Latest selectable time of day */
  maxTime?: Date;
  /** Infinite hour/minute wheels. Default: true */
  loop?: boolean;
  /** Zero-pad hours. Default: true for 24h, false for 12h */
  padHours?: boolean;
  /** Labels for AM/PM. Default: from locale */
  dayPeriodLabels?: [string, string];
  /** Put AM/PM before the hours (e.g. zh, ko). Default: false */
  dayPeriodFirst?: boolean;
  /** Separator between columns. Default: ':' */
  separator?: React.ReactNode;
  itemHeight?: number;
  visibleItems?: number;
  variant?: WheelVariant;
  style?: StyleProp<ViewStyle>;
  styles?: SlotStyles<MultiWheelSlot>;
  testID?: string;
}

/** The TimePicker props that shape its wheels, without the visual ones. */
export type TimeOptions = Omit<
  TimePickerProps,
  'value' | 'defaultValue' | 'onChange' | 'itemHeight' | 'visibleItems' | 'variant' | 'style' | 'styles' | 'theme'
>;

export type TimeColumnsOptions = TimeOptions & {
  date: Date;
  onChange: (date: Date) => void;
};

export type TimePickerSheetProps = SheetChromeProps &
  Omit<TimePickerProps, 'value' | 'defaultValue' | 'onChange' | 'theme'> & {
    value?: Date;
    onConfirm: (date: Date) => void;
  };

export type TimePickerFieldProps = WithPickerField<TimePickerSheetProps, MultiWheelSlot>;

export interface TimeParts {
  hours: number;
  minutes: number;
  seconds: number;
}

/** Selectable seconds of the day, inclusive. */
export type TimeBounds = [minSecond: number, maxSecond: number];

export type TimeColumnKey = 'period' | 'hour' | 'minute' | 'second';

/** A time wheel column before its change handlers are attached; `toPatch` maps a wheel value to the time parts it sets. */
export type TimeColumnSpec = Omit<WheelColumn<number>, 'onChange' | 'onValueChanging' | 'key'> & {
  key: TimeColumnKey;
  toPatch: (value: number) => Partial<TimeParts>;
};
