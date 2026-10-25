import type { StyleProp, ViewStyle } from 'react-native';

import type { CalendarBaseProps } from '../calendar/calendar.types';
import type { SlotStyles, ThemableProps } from '../core';
import type { SheetChromeProps } from '../sheet';
import type { TimeOptions } from '../time/time.types';
import type { MultiWheelSlot, WheelVariant } from '../wheel/wheel.types';

export type DateTimeDisplay = 'wheel' | 'calendar';

export type DateTimeCalendarProps = Omit<CalendarBaseProps, 'locale' | 'minDate' | 'maxDate' | 'theme' | 'testID'>;

export interface DateTimePickerProps extends ThemableProps, Omit<TimeOptions, 'minTime' | 'maxTime' | 'testID'> {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  /** 'wheel' (default): one row of day + time wheels. 'calendar': a month grid above the time wheels. */
  display?: DateTimeDisplay;
  /** Earliest selectable moment (date and time) */
  minDate?: Date;
  /** Latest selectable moment (date and time) */
  maxDate?: Date;
  /** Wheel display: label of each row in the day wheel. Default: 'Today', else e.g. 'Tue, Oct 27' */
  formatDay?: (date: Date, locale?: string) => string;
  /** Calendar display: passed through to the Calendar */
  calendarProps?: DateTimeCalendarProps;
  itemHeight?: number;
  /** Default: 5 for the wheel display, 3 under the calendar */
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

export type DateTimeViewProps = Omit<DateTimePickerProps, 'value' | 'defaultValue' | 'onChange' | 'display'> & {
  date: Date;
  onChange: (date: Date) => void;
};
