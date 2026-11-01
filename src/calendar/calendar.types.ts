import type React from 'react';
import type { Animated, GestureResponderHandlers, StyleProp, ViewStyle } from 'react-native';

import type { Locale, PickerTheme, SlotStyles, ThemableProps } from '../core';
import type { DeepPartial, ValueOf } from '../core/core.types';
import type { HorizontalListProps } from '../list/list.types';
import type { ARROW_DIRECTION, CALENDAR_MODE, CALENDAR_VIEW, DAY_SELECTION, TODAY_MARK, WEEKDAY_FORMAT } from './calendar.constants';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

/** The presets row's HorizontalList props, without the ones the calendar sets from the presets and the range. */
export type RangePresetsListProps = Omit<HorizontalListProps<DateRange>, 'items' | 'value' | 'onChange' | 'isEqual'>;

/** A shortcut that selects a whole range at once, such as "Last 7 days". */
export interface DateRangePreset {
  label: string;
  start: Date;
  end: Date;
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
  | 'gridCellText'
  | 'expandHandle';

export interface DayState {
  date: Date;
  selected: boolean;
  rangeStart: boolean;
  rangeEnd: boolean;
  inRange: boolean;
  /** The calendar picks ranges, so a chosen day is a range end, even the first tap of a range not finished yet. */
  ranged: boolean;
  today: boolean;
  disabled: boolean;
  outside: boolean;
  marking?: MarkedDate;
}

export type ArrowDirection = ValueOf<typeof ARROW_DIRECTION>;

export interface Weekday {
  /** 0 = Sunday ... 6 = Saturday */
  key: number;
  label: string;
}

export interface CalendarBaseProps extends ThemableProps {
  locale?: Locale;
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
  /** Default: from the design: 'short' on iOS and the web, 'narrow' (S M T) in Material */
  weekdayFormat?: ValueOf<typeof WEEKDAY_FORMAT>;
  showWeekdays?: boolean;
  /** Override the title text */
  formatTitle?: (month: Date, locale?: Locale) => string;
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
  | { mode?: typeof CALENDAR_MODE.single; value?: Date | null; defaultValue?: Date | null; onChange?: (date: Date) => void }
  | ({
      mode: typeof CALENDAR_MODE.range;
      value?: DateRange;
      defaultValue?: DateRange;
      onChange?: (range: DateRange) => void;
      /** Chips above the days that pick a whole range in one tap, such as `getRangePresets()` */
      presets?: DateRangePreset[];
      /** Any HorizontalList prop for the presets row, such as `variant`, `showArrows`, `renderItem` or `styles` */
      presetsProps?: RangePresetsListProps;
    } & RangeRules)
  | {
      mode: typeof CALENDAR_MODE.multiple;
      value?: Date[];
      defaultValue?: Date[];
      onChange?: (dates: Date[]) => void;
      maxSelections?: number;
    }
  | ({
      mode: typeof CALENDAR_MODE.ranges;
      value?: DateRange[];
      defaultValue?: DateRange[];
      onChange?: (ranges: DateRange[]) => void;
      maxRanges?: number;
    } & RangeRules);

export type CalendarProps = CalendarBaseProps & CalendarSelectionProps;

/** What every calendar sets up the same way before it draws. */
export type DayCalendarProps = Pick<
  CalendarBaseProps,
  'locale' | 'minDate' | 'maxDate' | 'isDateDisabled' | 'markedDates' | 'firstDayOfWeek' | 'weekdayFormat' | 'theme' | 'design'
> &
  CalendarSelectionProps;

export type WeekStripProps = Omit<
  CalendarBaseProps,
  'initialMonth' | 'onMonthChange' | 'showOutsideDays' | 'fixedWeeks' | 'enableQuickJump' | 'formatTitle' | 'yearRange'
> & {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date) => void;
  /** A day in the week shown first. Default: the selected day or today */
  initialWeek?: Date;
  /** Fires with the first day of the week shown after an arrow or a swipe */
  onWeekChange?: (weekStart: Date) => void;
  /** Show the month title and the week arrows. Default: true */
  showHeader?: boolean;
  /** Override the title text. Default: the month and year most of the week falls in */
  formatTitle?: (weekStart: Date, locale?: Locale) => string;
};

export type ExpandableCalendarProps = Omit<WeekStripProps, 'initialWeek' | 'formatTitle'> & {
  /** Showing the whole month rather than one week (controlled) */
  expanded?: boolean;
  /** Initial state when uncontrolled. Default: false */
  defaultExpanded?: boolean;
  /** Fires when the user opens or folds the month: the handle, or a drag down or up */
  onExpandedChange?: (expanded: boolean) => void;
  /** A day in the week and month shown first. Default: the selected day or today */
  initialDate?: Date;
  /** Fires with the first of the month shown after an arrow or a swipe while open */
  onMonthChange?: (month: Date) => void;
  /** Override the title text. Default: the month and year shown */
  formatTitle?: (month: Date, locale?: Locale) => string;
};

export interface CalendarExpansion {
  /** The month grid is drawn: open, or animating */
  showsMonth: boolean;
  grid: Date[][];
  /** Dragging down or up opens or folds the month, which follows the finger */
  panHandlers: GestureResponderHandlers;
  /** Clips the grid to one row folded and all of them open */
  clipStyle: { height: Animated.AnimatedInterpolation<number> };
  /** Shifts the month up so the week it opens from or folds into stays in place; none while folded */
  gridStyle?: { transform: { translateY: Animated.AnimatedInterpolation<number> }[] };
}

export interface ExpandHandleProps {
  expanded: boolean;
  onPress: () => void;
  theme: PickerTheme;
  slots?: SlotStyles<CalendarSlot>;
}

export type CalendarMode = NonNullable<CalendarSelectionProps['mode']>;

export type CalendarView = ValueOf<typeof CALENDAR_VIEW>;

/** The current selection of every mode, so rendering never needs to narrow props. */
export interface CalendarSelection {
  mode: CalendarMode;
  single: Date | null;
  range: DateRange;
  multiple: Date[];
  ranges: DateRange[];
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
  onTitlePress?: () => void;
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
  locale?: Locale;
  renderDay?: CalendarBaseProps['renderDay'];
  onDayPress: (date: Date) => void;
  theme: PickerTheme;
  slots?: SlotStyles<CalendarSlot>;
}

export interface WeekdayRowProps {
  weekdays: Weekday[];
  theme: PickerTheme;
  slots?: SlotStyles<CalendarSlot>;
}

export interface DayCellProps {
  state: DayState;
  hidden: boolean;
  hasRangeEnd: boolean;
  height: number;
  locale?: Locale;
  renderDay?: CalendarBaseProps['renderDay'];
  onSelect: (date: Date) => void;
  theme: PickerTheme;
  slots?: SlotStyles<CalendarSlot>;
}

export interface RangePresetsProps {
  presets: DateRangePreset[];
  range: DateRange;
  rules: RangeRules;
  isDisabled: (day: Date) => boolean;
  onSelect: (range: DateRange) => void;
  theme?: DeepPartial<PickerTheme>;
  listProps?: RangePresetsListProps;
}

export interface QuickGridProps {
  cells: QuickCell[];
  height: number;
  onSelect: (value: number) => void;
  theme: PickerTheme;
  slots?: SlotStyles<CalendarSlot>;
}

export interface CalendarDesign {
  /** The chosen day filled with the primary colour, or tinted with its number in the primary colour */
  selection: ValueOf<typeof DAY_SELECTION>;
  today: ValueOf<typeof TODAY_MARK>;
  /** Rounded squares rather than circles */
  squareDays: boolean;
  weekdayFormat: ValueOf<typeof WEEKDAY_FORMAT>;
  uppercaseWeekdays: boolean;
  arrowColor: keyof PickerTheme['colors'];
}
