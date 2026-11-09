import type React from 'react';
import type { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';

import type { Locale, PickerTheme, SlotStyles, ThemableProps } from '../core';
import type { ValueOf } from '../core/core.types';
import type { TimeFormat } from '../time/time.types';
import type { AGENDA_LAYOUT, EVENT_FILL, NOW_MARKER, ROW_KIND } from './schedule.constants';

/** Something on the calendar: a meeting, a class, a booking. Extend it with your own fields; callbacks get your type back. */
export interface ScheduleEvent {
  /** Unique, used as the React key */
  id: string;
  title: string;
  start: Date;
  end: Date;
  /** Drawn in the all-day row of a timeline and as "All day" in an agenda. It covers every day from `start` to `end`, both included */
  allDay?: boolean;
  /** A hex color, such as `'#2E7D32'`. Default: the theme's `primary` */
  color?: string;
  /** A second line, such as a place or a person */
  subtitle?: string;
}

/** The new event a tap on an empty part of a timeline suggests. */
export interface TimeSlot {
  start: Date;
  end: Date;
}

/** An event's part on one day: the whole event, or the hours of a longer one that fall on that day. */
export interface EventSegment<T extends ScheduleEvent = ScheduleEvent> {
  event: T;
  start: Date;
  end: Date;
  /** The event started on an earlier day */
  continuesBefore: boolean;
  /** The event goes on past this day */
  continuesAfter: boolean;
}

/** A segment placed among the ones it overlaps: its column, of how many, and how many free columns it widens into. */
export interface PositionedSegment<T extends ScheduleEvent = ScheduleEvent> extends EventSegment<T> {
  column: number;
  columns: number;
  span: number;
}

export type EventFill = ValueOf<typeof EVENT_FILL>;
export type NowMarker = ValueOf<typeof NOW_MARKER>;
export type AgendaLayout = ValueOf<typeof AGENDA_LAYOUT>;
export type RowKind = ValueOf<typeof ROW_KIND>;

/** How a design draws a timeline and an agenda. */
export interface ScheduleDesign {
  eventFill: EventFill;
  nowMarker: NowMarker;
  /** Label the lines at the top and the bottom of the grid. Google Calendar leaves them out */
  labelEnds: boolean;
  /** The weekday and the date on one line over a day, as iOS does, rather than one over the other */
  inlineDayHeader: boolean;
  agendaLayout: AgendaLayout;
  uppercaseWeekdays: boolean;
}

/** The colors an event draws with, worked out from its color and the design. */
export interface EventColors {
  background: string;
  text: string;
  /** iOS's bar down the event's leading edge; null where the event is filled */
  bar: string | null;
}

export interface ScheduleLabels {
  /** Default: 'All day' */
  allDay: string;
  /** Default: 'No events' */
  noEvents: string;
}

/** What a custom event gets to draw with. */
export interface ScheduleEventInfo<T extends ScheduleEvent = ScheduleEvent> {
  event: T;
  /** Where the event starts on this day: its start, or midnight for one that began earlier */
  start: Date;
  /** Where it ends on this day */
  end: Date;
  /** Covers the whole day */
  allDay: boolean;
  /** The event's text, such as "9:00 AM – 10:00 AM", or the all-day label */
  timeText: string;
  colors: EventColors;
  theme: PickerTheme;
}

export interface ScheduleDayInfo {
  date: Date;
  today: boolean;
  theme: PickerTheme;
}

export interface ScheduleBaseProps<T extends ScheduleEvent> extends ThemableProps {
  events: readonly T[];
  locale?: Locale;
  /** '12h' (9:00 AM), '24h' (09:00) or 'auto' from the locale. Default: 'auto' */
  format?: TimeFormat;
  onEventPress?: (event: T) => void;
  onEventLongPress?: (event: T) => void;
  /** Words the component shows, for other languages */
  labels?: Partial<ScheduleLabels>;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export type TimelineSlot =
  | 'container'
  | 'dayHeader'
  | 'dayHeaderText'
  | 'allDayRow'
  | 'hourLabel'
  | 'hourLine'
  | 'dayColumn'
  | 'event'
  | 'eventTitle'
  | 'eventText'
  | 'nowLine';

export interface TimelineProps<T extends ScheduleEvent = ScheduleEvent> extends ScheduleBaseProps<T> {
  /** The first day shown (controlled) */
  date?: Date;
  /** The first day shown at first, when uncontrolled. Default: today */
  defaultDate?: Date;
  /** Fires with the new first day when the user swipes to the next or previous days */
  onDateChange?: (date: Date) => void;
  /** Days side by side, 1 to 7. Default: 1 */
  numberOfDays?: number;
  /** The first hour drawn, 0–23. Default: 0 */
  startHour?: number;
  /** The hour the grid ends at, 1–24. Default: 24 */
  endHour?: number;
  /** Height of one hour. Default: 60 */
  hourHeight?: number;
  /** The hour scrolled to the top at first. Default: an hour before now when today is shown, else the first event, else 8 */
  initialScrollHour?: number;
  /** A line at the current time across today. Default: true */
  showNowIndicator?: boolean;
  /** The weekday and date above each day. Default: true when more than one day is shown */
  showDayHeader?: boolean;
  /** Swipe sideways to the next or previous days. Default: true */
  enableSwipe?: boolean;
  /** A tap on an empty part of the grid, with an hour-long slot starting where it was tapped */
  onSlotPress?: (slot: TimeSlot) => void;
  /** The minutes a tapped slot's start snaps down to. Default: 30 */
  snapMinutes?: number;
  /** A tap on a day's date in the header */
  onDayPress?: (date: Date) => void;
  /** Fully custom event block */
  renderEvent?: (info: ScheduleEventInfo<T>) => React.ReactNode;
  /** Fully custom date in the header */
  renderDayHeader?: (info: ScheduleDayInfo) => React.ReactNode;
  styles?: SlotStyles<TimelineSlot>;
}

export type AgendaSlot = 'container' | 'dayHeader' | 'dayHeaderText' | 'date' | 'event' | 'eventTitle' | 'eventText' | 'emptyText';

export interface AgendaProps<T extends ScheduleEvent = ScheduleEvent> extends ScheduleBaseProps<T> {
  /** The day scrolled to the top. Changing it scrolls there, to the next day with events if it has none. Default: today */
  selectedDate?: Date;
  /** Fires with the day at the top as the user scrolls, to keep a calendar above in step */
  onVisibleDateChange?: (date: Date) => void;
  /** List the days between the first and the last event that have nothing on, as "No events". Default: false */
  showEmptyDays?: boolean;
  /** Fully custom event row */
  renderEvent?: (info: ScheduleEventInfo<T>) => React.ReactNode;
  /** Fully custom date: the band over the day on iOS, the date beside its events in Material and on the web */
  renderDayHeader?: (info: ScheduleDayInfo) => React.ReactNode;
  /** Load more as the end comes into view */
  onEndReached?: () => void;
  /** Pull to refresh */
  onRefresh?: () => void;
  refreshing?: boolean;
  ListHeaderComponent?: React.ReactElement;
  ListFooterComponent?: React.ReactElement;
  styles?: SlotStyles<AgendaSlot>;
}

/** A row of the agenda's list: a day's band, one of its events, or the "No events" of an empty day. */
export interface AgendaRow<T extends ScheduleEvent = ScheduleEvent> {
  kind: RowKind;
  key: string;
  date: Date;
  dateKey: string;
  /** The day's first row, which carries the date in Material and on the web */
  first: boolean;
  segment?: EventSegment<T>;
  allDay: boolean;
}

export interface AgendaRows<T extends ScheduleEvent = ScheduleEvent> {
  rows: AgendaRow<T>[];
  /** The rows that stick to the top: the days' bands on iOS */
  headerIndices: number[];
  /** Each day's `YYYY-MM-DD` key, in order */
  dayKeys: string[];
  /** The first row of each day, by its key */
  indexByDay: Record<string, number>;
}

/** Turns an event's part on a day into what it draws with. */
export type EventInfoFor<T extends ScheduleEvent> = (
  segment: Pick<EventSegment<T>, 'event' | 'start' | 'end'>,
  allDay: boolean
) => ScheduleEventInfo<T>;

export interface TimelineColumn<T extends ScheduleEvent> {
  day: Date;
  key: string;
  segments: PositionedSegment<T>[];
  allDay: T[];
}

interface EventPressProps<T extends ScheduleEvent> {
  onPress?: (event: T) => void;
  onLongPress?: (event: T) => void;
}

export interface EventContentProps<T extends ScheduleEvent> {
  info: ScheduleEventInfo<T>;
  height: number;
  /** Too narrow for more than one line of title */
  compact?: boolean;
  renderEvent?: (info: ScheduleEventInfo<T>) => React.ReactNode;
  slots?: SlotStyles<TimelineSlot>;
}

export interface TimelineEventProps<T extends ScheduleEvent> extends EventContentProps<T>, EventPressProps<T> {}

export interface AllDayChipProps<T extends ScheduleEvent> extends Omit<EventContentProps<T>, 'height'>, EventPressProps<T> {}

export interface AllDayRowProps<T extends ScheduleEvent> {
  columns: TimelineColumn<T>[];
  label: string;
  infoFor: EventInfoFor<T>;
  renderEvent?: (info: ScheduleEventInfo<T>) => React.ReactNode;
  onEventPress?: (event: T) => void;
  onEventLongPress?: (event: T) => void;
  theme: PickerTheme;
  slots?: SlotStyles<TimelineSlot>;
}

export interface DayColumnProps<T extends ScheduleEvent> extends Omit<AllDayRowProps<T>, 'columns' | 'label'> {
  day: Date;
  segments: PositionedSegment<T>[];
  /** How many days share the grid's width */
  days: number;
  /** The leftmost column, which has no line before it */
  first: boolean;
  startHour: number;
  hourHeight: number;
  onPressSlot?: (day: Date, e: GestureResponderEvent) => void;
  testID?: string;
}

export interface HourGridProps {
  hours: number[];
  startHour: number;
  hourHeight: number;
  theme: PickerTheme;
  slots?: SlotStyles<TimelineSlot>;
}

export interface HourGutterProps extends HourGridProps {
  hour12: boolean;
  locale?: Locale;
  now: Date;
  nowOffset: number | null;
  design: ScheduleDesign;
}

export interface NowIndicatorProps {
  offset: number;
  dayIndex: number;
  days: number;
  design: ScheduleDesign;
  theme: PickerTheme;
  slots?: SlotStyles<TimelineSlot>;
}

export interface DayHeaderCellProps {
  info: ScheduleDayInfo;
  locale?: Locale;
  /** The weekday and the date on one line */
  inline: boolean;
  uppercase: boolean;
  renderDayHeader?: (info: ScheduleDayInfo) => React.ReactNode;
  slots?: SlotStyles<TimelineSlot>;
}

export interface TimelineDayHeaderProps {
  days: Date[];
  todayIndex: number;
  locale?: Locale;
  design: ScheduleDesign;
  onDayPress?: (date: Date) => void;
  renderDayHeader?: (info: ScheduleDayInfo) => React.ReactNode;
  theme: PickerTheme;
  slots?: SlotStyles<TimelineSlot>;
}

export interface AgendaDateProps {
  info: ScheduleDayInfo;
  locale?: Locale;
  layout: AgendaLayout;
  renderDayHeader?: (info: ScheduleDayInfo) => React.ReactNode;
  slots?: SlotStyles<AgendaSlot>;
}

export interface AgendaEventContentProps<T extends ScheduleEvent> {
  info: ScheduleEventInfo<T>;
  layout: AgendaLayout;
  locale?: Locale;
  hour12: boolean;
  renderEvent?: (info: ScheduleEventInfo<T>) => React.ReactNode;
  slots?: SlotStyles<AgendaSlot>;
}

export interface AgendaItemProps<T extends ScheduleEvent> {
  row: AgendaRow<T>;
  today: boolean;
  layout: AgendaLayout;
  locale?: Locale;
  hour12: boolean;
  labels: ScheduleLabels;
  infoFor: EventInfoFor<T>;
  renderEvent?: (info: ScheduleEventInfo<T>) => React.ReactNode;
  renderDayHeader?: (info: ScheduleDayInfo) => React.ReactNode;
  onEventPress?: (event: T) => void;
  onEventLongPress?: (event: T) => void;
  theme: PickerTheme;
  slots?: SlotStyles<AgendaSlot>;
}
