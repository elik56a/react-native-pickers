import type React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { PickerTheme, SlotStyles, ThemableProps } from '../core';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface MarkedDate {
  /** Dot colors under the day number */
  dots?: string[];
  disabled?: boolean;
  /** Small text under the day (e.g. a price) */
  label?: string;
  textColor?: string;
}

export type CalendarSlot =
  | 'container'
  | 'header'
  | 'headerTitle'
  | 'arrow'
  | 'arrowText'
  | 'weekdays'
  | 'weekdayText'
  | 'week'
  | 'day'
  | 'dayInner'
  | 'dayText'
  | 'selectedDay'
  | 'selectedDayText'
  | 'todayDay'
  | 'todayDayText'
  | 'disabledDayText'
  | 'outsideDayText'
  | 'rangeBand'
  | 'dot'
  | 'dayLabel'
  | 'gridCell'
  | 'gridCellText';

export interface DayState {
  date: Date;
  selected: boolean;
  rangeStart: boolean;
  rangeEnd: boolean;
  inRange: boolean;
  today: boolean;
  disabled: boolean;
  outside: boolean;
  marking?: MarkedDate;
}

export type ArrowDirection = 'prev' | 'next';

export interface Weekday {
  /** 0 = Sunday ... 6 = Saturday */
  key: number;
  label: string;
}

export interface CalendarBaseProps extends ThemableProps {
  locale?: string;
  minDate?: Date;
  maxDate?: Date;
  /** Return true to disable a day */
  isDateDisabled?: (date: Date) => boolean;
  /** 0 = Sunday ... 6 = Saturday. Default: from locale, else 0 */
  firstDayOfWeek?: number;
  /** Keyed by `YYYY-MM-DD` */
  markedDates?: Record<string, MarkedDate>;
  /** Month shown initially. Default: the selected date or today */
  initialMonth?: Date;
  onMonthChange?: (month: Date) => void;
  showOutsideDays?: boolean;
  /** Always render 6 weeks to keep the height stable. Default: true */
  fixedWeeks?: boolean;
  /** Swipe left/right to change months. Default: true */
  enableSwipe?: boolean;
  /** Tap the title to jump by month / year. Default: true */
  enableQuickJump?: boolean;
  weekdayFormat?: 'short' | 'narrow';
  showWeekdays?: boolean;
  /** Override the title text */
  formatTitle?: (month: Date, locale?: string) => string;
  /** Fully custom day cell */
  renderDay?: (state: DayState, theme: PickerTheme) => React.ReactNode;
  /** Custom arrows */
  renderArrow?: (direction: ArrowDirection, disabled: boolean) => React.ReactNode;
  /** Range of years in the year grid. Default: minDate/maxDate or ±100 years */
  yearRange?: [number, number];
  /** Day cell height. Default: 44 */
  dayHeight?: number;
  style?: StyleProp<ViewStyle>;
  styles?: SlotStyles<CalendarSlot>;
  testID?: string;
}

export interface RangeRules {
  /** Minimum nights in a range (end - start, in days) */
  minRangeDays?: number;
  maxRangeDays?: number;
  /** Allow start === end. Default: true */
  allowSingleDayRange?: boolean;
}

export type CalendarSelectionProps =
  | { mode?: 'single'; value?: Date | null; defaultValue?: Date | null; onChange?: (date: Date) => void }
  | ({ mode: 'range'; value?: DateRange; defaultValue?: DateRange; onChange?: (range: DateRange) => void } & RangeRules)
  | { mode: 'multiple'; value?: Date[]; defaultValue?: Date[]; onChange?: (dates: Date[]) => void; maxSelections?: number };

export type CalendarProps = CalendarBaseProps & CalendarSelectionProps;

export type CalendarMode = NonNullable<CalendarSelectionProps['mode']>;

export type CalendarView = 'days' | 'months' | 'years';

/** The current selection of every mode, so rendering never needs to narrow props. */
export interface CalendarSelection {
  mode: CalendarMode;
  single: Date | null;
  range: DateRange;
  multiple: Date[];
}

export interface DayDisabledRules {
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  markedDates?: Record<string, MarkedDate>;
}

export interface QuickCell {
  key: string;
  label: string;
  /** Month index (0–11) in the month grid, full year in the year grid */
  value: number;
  selected: boolean;
  disabled: boolean;
}

export interface CalendarHeaderProps {
  label: string;
  accessibilityLabel: string;
  view: CalendarView;
  enableQuickJump: boolean;
  isArrowDisabled: (direction: ArrowDirection) => boolean;
  onTitlePress: () => void;
  onArrowPress: (direction: ArrowDirection) => void;
  renderArrow?: CalendarBaseProps['renderArrow'];
  rtl: boolean;
  theme: PickerTheme;
  slots?: SlotStyles<CalendarSlot>;
}

export interface DayGridProps {
  weeks: DayState[][];
  weekdays: Weekday[];
  showWeekdays: boolean;
  showOutsideDays: boolean;
  hasRangeEnd: boolean;
  dayHeight: number;
  locale?: string;
  renderDay?: CalendarBaseProps['renderDay'];
  onDayPress: (date: Date) => void;
  theme: PickerTheme;
  slots?: SlotStyles<CalendarSlot>;
}

export interface DayCellProps {
  state: DayState;
  hidden: boolean;
  hasRangeEnd: boolean;
  height: number;
  locale?: string;
  renderDay?: CalendarBaseProps['renderDay'];
  onSelect: (date: Date) => void;
  theme: PickerTheme;
  slots?: SlotStyles<CalendarSlot>;
}

export interface QuickGridProps {
  cells: QuickCell[];
  height: number;
  onSelect: (value: number) => void;
  theme: PickerTheme;
  slots?: SlotStyles<CalendarSlot>;
}
