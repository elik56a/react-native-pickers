import type React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { Locale, SlotStyles, ThemableProps } from '../core';
import type { ValueOf } from '../core/core.types';
import type { PickerTheme } from '../core/theme/theme.types';
import type { SelectOption } from '../select/select.types';
import type { SheetChromeProps, WithPickerField } from '../sheet';
import type { MultiWheelSlot, WheelColumn, WheelVariant } from '../wheel/wheel.types';
import type { useClockDial } from './hooks/useClockDial';
import type { CLOCK_MODE, TIME_COLUMN, TIME_DISPLAY, TIME_FORMAT } from './time.constants';

export type TimeFormat = ValueOf<typeof TIME_FORMAT>;
export type TimeDisplay = ValueOf<typeof TIME_DISPLAY>;
export type ClockMode = ValueOf<typeof CLOCK_MODE>;

export interface TimePickerProps extends ThemableProps {
  /** Selected time (the date part is preserved). */
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  /** Fires on every tick while scrolling (for haptics). */
  onValueChanging?: (date: Date) => void;
  /** Wheels, a clock dial, or a list of times (stepping by `minuteInterval`, or 15 minutes). Default: wheels on iOS, a dial in Material, a list on the web. With `showSeconds`, a dial falls back to wheels */
  display?: TimeDisplay;
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
  'value' | 'defaultValue' | 'onChange' | 'itemHeight' | 'visibleItems' | 'variant' | 'style' | 'styles' | 'theme' | 'display'
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

export type TimeColumnKey = ValueOf<typeof TIME_COLUMN>;

/** A time wheel column before its change handlers are attached; `toPatch` maps a wheel value to the time parts it sets. */
export type TimeColumnSpec = Omit<WheelColumn<number>, 'onChange' | 'onValueChanging' | 'key'> & {
  key: TimeColumnKey;
  toPatch: (value: number) => Partial<TimeParts>;
};

export interface TimeListProps {
  date: Date;
  onChange: (date: Date) => void;
  options: TimeOptions;
  visibleRows?: number;
  theme: PickerTheme;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export type TimeListItem = SelectOption<number>;

export interface DialNumber {
  /** An hour of the day (12h: 1–12) or a minute */
  value: number;
  label: string;
  /** The number's centre on the dial */
  x: number;
  y: number;
  /** On the inner ring of a 24h dial */
  inner: boolean;
  disabled: boolean;
}

export interface ClockDialProps {
  date: Date;
  onChange: (date: Date) => void;
  options: TimeOptions;
  theme: PickerTheme;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export type ClockDialState = ReturnType<typeof useClockDial>;

export interface ClockPartProps {
  dial: ClockDialState;
  theme: PickerTheme;
  testID?: string;
}
