import type { StyleProp, ViewStyle } from 'react-native';

import type { CalendarBaseProps, CalendarProps, CalendarSlot, DateRange } from '../calendar/calendar.types';
import type { Locale, SlotStyles, ThemableProps } from '../core';
import type { SheetChromeProps, WithPickerField } from '../sheet';
import type { MultiWheelSlot, WheelColumn, WheelVariant } from '../wheel/wheel.types';

export type DatePart = 'day' | 'month' | 'year';

export type MonthFormat = 'long' | 'short' | 'numeric';

export interface DateWheelPickerProps extends ThemableProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  onValueChanging?: (date: Date) => void;
  locale?: Locale;
  minDate?: Date;
  maxDate?: Date;
  /** Column order. Default: from locale (e.g. M/D/Y for en-US, D/M/Y for he) */
  order?: DatePart[];
  /** 'long' (January), 'short' (Jan) or 'numeric' (01). Default: 'long' */
  monthFormat?: MonthFormat;
  /** Years when no min/max is given. Default: ±100 from today */
  yearRange?: [number, number];
  /** Loop the day and month wheels. Default: true */
  loop?: boolean;
  itemHeight?: number;
  visibleItems?: number;
  variant?: WheelVariant;
  style?: StyleProp<ViewStyle>;
  styles?: SlotStyles<MultiWheelSlot>;
  testID?: string;
}

export type DatePickerProps = ({ display?: 'calendar' } & CalendarProps) | ({ display: 'wheel' } & DateWheelPickerProps);

export type DateSheetMode = 'single' | 'range' | 'multiple';

export type DateSheetSelection =
  | { mode?: 'single'; value?: Date | null; onConfirm: (date: Date) => void }
  | { mode: 'range'; value?: DateRange; onConfirm: (range: DateRange) => void; minRangeDays?: number; maxRangeDays?: number }
  | { mode: 'multiple'; value?: Date[]; onConfirm: (dates: Date[]) => void; maxSelections?: number };

/** What a date sheet holds while open: one date, a range or a list, depending on the mode. */
export type DateDraft = Date | DateRange | Date[] | null;

export type DatePickerSheetProps = SheetChromeProps &
  Omit<CalendarBaseProps, 'theme'> &
  DateSheetSelection & {
    /** 'calendar' (default) or 'wheel' (single mode only) */
    display?: 'calendar' | 'wheel';
    wheelProps?: Partial<DateWheelPickerProps>;
    /** Single mode: confirm as soon as a day is tapped. Default: false */
    confirmOnSelect?: boolean;
  };

export type DatePickerFieldProps = WithPickerField<DatePickerSheetProps, CalendarSlot>;

/** A date wheel column before its change handlers are attached. */
export type DateColumnSpec = Omit<WheelColumn<number>, 'onChange' | 'onValueChanging'>;
