import type { StyleProp, ViewStyle } from 'react-native';

import type { CalendarBaseProps } from '../calendar/calendar.types';
import type { Locale, SlotStyles, ThemableProps } from '../core';
import type { PickerDisplay, ValueOf } from '../core/core.types';
import type { SheetChromeProps, WithPickerField } from '../sheet';
import type { TimeDisplay, TimeOptions } from '../time/time.types';
import type { MultiWheelSlot, WheelVariant } from '../wheel/wheel.types';
import type { TIME_POSITION } from './datetime.constants';

export type DateTimeDisplay = PickerDisplay;

export type TimePosition = ValueOf<typeof TIME_POSITION>;

export type DateTimeCalendarProps = Omit<CalendarBaseProps, 'locale' | 'minDate' | 'maxDate' | 'theme' | 'testID'>;

export interface DateTimePickerProps extends ThemableProps, Omit<TimeOptions, 'minTime' | 'maxTime' | 'testID'> {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  /** 'wheel': one row of day + time wheels (the iOS default). 'calendar': a month grid and the time, as the design shows time (the Material and web default) */
  display?: DateTimeDisplay;
  /** Calendar display: the time beside the calendar (under it when there's no room) or below it. Default: 'beside' on the web, 'below' in iOS and Material */
  timePosition?: TimePosition;
  /** Calendar display: how the time is picked: 'wheel', 'dial', 'input' or 'list'. Default: wheels in iOS, 'input' in Material, 'list' on the web */
  timeDisplay?: TimeDisplay;
  /** Earliest selectable moment (date and time) */
  minDate?: Date;
  /** Latest selectable moment (date and time) */
  maxDate?: Date;
  /** Wheel display: label of each row in the day wheel. Default: 'Today', else e.g. 'Tue, Oct 27' */
  formatDay?: (date: Date, locale?: Locale) => string;
  /** Calendar display: passed through to the Calendar */
  calendarProps?: DateTimeCalendarProps;
  itemHeight?: number;
  /** Default: 5 for the wheel display; 3 wheels or 5 web time rows under the calendar, 9 rows beside it */
  visibleItems?: number;
  variant?: WheelVariant;
  style?: StyleProp<ViewStyle>;
  /** Slot styles of the wheels */
  styles?: SlotStyles<MultiWheelSlot>;
  testID?: string;
}

export type DateTimePickerSheetProps = SheetChromeProps &
  Omit<DateTimePickerProps, 'value' | 'defaultValue' | 'onChange' | 'theme'> & {
    value?: Date;
    onConfirm: (date: Date) => void;
  };

export type DateTimePickerFieldProps = WithPickerField<DateTimePickerSheetProps, MultiWheelSlot>;

export type DateTimeViewProps = Omit<
  DateTimePickerProps,
  'value' | 'defaultValue' | 'onChange' | 'display' | 'timePosition' | 'timeDisplay'
> & {
  date: Date;
  onChange: (date: Date) => void;
  /** How the calendar display shows the time */
  timeDisplay: TimeDisplay;
  timePosition: TimePosition;
};

export interface DateTimeDesign {
  display: DateTimeDisplay;
  timeDisplay: TimeDisplay;
  timePosition: TimePosition;
}
