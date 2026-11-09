import { getCheckColor, hexToRgb, normalizeHex, rgbToHex, withAlpha } from '../color/color.utils';
import type { PickerTheme } from '../core/theme/theme.types';
import { addDays, compareDay, formatDate, isSameDay, startOfDay, toDateKey } from '../core/utils/date.utils';
import {
  DEFAULT_SCHEDULE_LABELS,
  DEFAULT_SCROLL_HOUR,
  EVENT_FILL,
  HOUR_MS,
  HOURS_PER_DAY,
  MAX_TIMELINE_DAYS,
  MINUTE_MS,
  MINUTES_PER_HOUR,
  NEW_EVENT_MINUTES,
  ROW_KIND,
  TINT_ALPHA,
} from './schedule.constants';
import type {
  AgendaRow,
  AgendaRows,
  EventColors,
  EventFill,
  EventSegment,
  PositionedSegment,
  ScheduleEvent,
  ScheduleLabels,
  TimeSlot,
} from './schedule.types';

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

/** The hour window a timeline draws: `startHour` 0–23 and `endHour` after it, up to 24. */
export const resolveHours = (startHour = 0, endHour = HOURS_PER_DAY): [number, number] => {
  const start = clamp(Math.floor(startHour), 0, HOURS_PER_DAY - 1);
  return [start, clamp(Math.ceil(endHour), start + 1, HOURS_PER_DAY)];
};

export const resolveNumberOfDays = (count = 1) => clamp(Math.round(count), 1, MAX_TIMELINE_DAYS);

/** The days shown side by side, from `date`. */
export const getTimelineDays = (date: Date, count: number) => Array.from({ length: count }, (_, i) => addDays(startOfDay(date), i));

export const getHours = (startHour: number, endHour: number) => Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);

const atHour = (day: Date, hour: number) => new Date(startOfDay(day).getTime() + hour * HOUR_MS);

/** A day's timed events, each cut to the hours drawn, oldest first. All-day events are left for the all-day row. */
export const getDaySegments = <T extends ScheduleEvent>(
  events: readonly T[],
  day: Date,
  startHour = 0,
  endHour = HOURS_PER_DAY
): EventSegment<T>[] => {
  const from = atHour(day, startHour);
  const to = atHour(day, endHour);
  const dayStart = startOfDay(day).getTime();
  const nextDay = addDays(startOfDay(day), 1).getTime();
  return events
    .filter((event) => {
      if (event.allDay) return false;
      const start = event.start.getTime();
      const end = event.end.getTime();
      // An event with no length still shows, at its start.
      return start < to.getTime() && (end > from.getTime() || (end <= start && start >= from.getTime()));
    })
    .map((event) => ({
      event,
      start: new Date(Math.max(event.start.getTime(), from.getTime())),
      end: new Date(Math.max(Math.min(event.end.getTime(), to.getTime()), event.start.getTime())),
      continuesBefore: event.start.getTime() < dayStart,
      continuesAfter: event.end.getTime() > nextDay,
    }))
    .sort(bySegmentStart);
};

const bySegmentStart = (a: EventSegment, b: EventSegment) =>
  a.start.getTime() - b.start.getTime() || b.end.getTime() - a.end.getTime() || a.event.id.localeCompare(b.event.id);

/** The all-day events that cover `day`. */
export const getAllDayEvents = <T extends ScheduleEvent>(events: readonly T[], day: Date) =>
  events.filter((event) => event.allDay && compareDay(event.start, day) <= 0 && compareDay(event.end, day) >= 0);

/**
 * Places the segments that overlap side by side, as calendar apps do: each takes the first column free when it starts,
 * a group of overlapping segments shares its column count, and a segment widens into the columns to its right that
 * nothing it overlaps sits in. `minDurationMs` is the length the shortest segment is drawn at, so a short one that's drawn
 * taller still counts as overlapping the one under it.
 */
export const layoutSegments = <T extends ScheduleEvent>(segments: EventSegment<T>[], minDurationMs = 0): PositionedSegment<T>[] => {
  const sorted = [...segments].sort(bySegmentStart);
  const visualEnd = (s: EventSegment<T>) => Math.max(s.end.getTime(), s.start.getTime() + minDurationMs);
  const overlaps = (a: EventSegment<T>, b: EventSegment<T>) => a.start.getTime() < visualEnd(b) && b.start.getTime() < visualEnd(a);
  const placed: PositionedSegment<T>[] = [];
  let group: { segment: EventSegment<T>; column: number }[] = [];
  let columnEnds: number[] = [];
  let groupEnd = Number.NEGATIVE_INFINITY;

  const closeGroup = () => {
    const columns = columnEnds.length;
    for (const { segment, column } of group) {
      let span = 1;
      while (column + span < columns && !group.some((g) => g.column === column + span && overlaps(g.segment, segment))) span++;
      placed.push({ ...segment, column, columns, span });
    }
    group = [];
    columnEnds = [];
  };

  for (const segment of sorted) {
    if (segment.start.getTime() >= groupEnd) closeGroup();
    const free = columnEnds.findIndex((end) => end <= segment.start.getTime());
    const column = free === -1 ? columnEnds.length : free;
    columnEnds[column] = visualEnd(segment);
    group.push({ segment, column });
    groupEnd = Math.max(groupEnd, visualEnd(segment));
  }
  closeGroup();
  return placed;
};

/** Minutes from the top of the grid to `date`, on the day it's on. */
const minutesFromTop = (date: Date, startHour: number) =>
  (date.getTime() - startOfDay(date).getTime()) / MINUTE_MS - startHour * MINUTES_PER_HOUR;

/** Where a segment sits in its day's column, and how tall it is. */
export const getSegmentFrame = (
  segment: Pick<EventSegment, 'start' | 'end'>,
  { startHour, hourHeight, minHeight }: { startHour: number; hourHeight: number; minHeight: number }
) => {
  const top = (minutesFromTop(segment.start, startHour) / MINUTES_PER_HOUR) * hourHeight;
  // A segment cut at midnight ends on the next day, at the bottom of this one.
  const endMinutes = isSameDay(segment.start, segment.end)
    ? minutesFromTop(segment.end, startHour)
    : HOURS_PER_DAY * MINUTES_PER_HOUR - startHour * MINUTES_PER_HOUR;
  const height = Math.max(((endMinutes - minutesFromTop(segment.start, startHour)) / MINUTES_PER_HOUR) * hourHeight, minHeight);
  return {
    top,
    height,
  };
};

/** The hour-long slot a tap `y` points down a day's column starts, snapped down to `snapMinutes`. */
export const getSlotAt = (
  day: Date,
  y: number,
  { startHour, endHour, hourHeight, snapMinutes }: { startHour: number; endHour: number; hourHeight: number; snapMinutes: number }
): TimeSlot => {
  const step = Math.max(1, snapMinutes);
  const minutes = clamp((y / hourHeight) * MINUTES_PER_HOUR, 0, (endHour - startHour) * MINUTES_PER_HOUR - step);
  const start = new Date(atHour(day, startHour).getTime() + Math.floor(minutes / step) * step * MINUTE_MS);
  return {
    start,
    end: new Date(start.getTime() + NEW_EVENT_MINUTES * MINUTE_MS),
  };
};

/** Pixels from the top of the grid to `now`, or null when it's outside the hours drawn. */
export const getNowOffset = (now: Date, startHour: number, endHour: number, hourHeight: number) => {
  const minutes = minutesFromTop(now, startHour);
  if (minutes < 0 || minutes > (endHour - startHour) * MINUTES_PER_HOUR) return null;
  return (minutes / MINUTES_PER_HOUR) * hourHeight;
};

/** The hour to open at: an hour before now when today is shown, else the first timed event, else 8 in the morning. */
export const getInitialScrollHour = <T extends ScheduleEvent>({
  days,
  events,
  now,
  startHour,
  endHour,
}: {
  days: Date[];
  events: readonly T[];
  now: Date;
  startHour: number;
  endHour: number;
}) => {
  const inView = (hour: number) => clamp(hour, startHour, endHour - 1);
  if (days.some((day) => isSameDay(day, now))) return inView(now.getHours() - 1);
  const first = days
    .flatMap((day) => getDaySegments(events, day, startHour, endHour))
    .reduce<number | null>((earliest, s) => Math.min(earliest ?? HOURS_PER_DAY, s.start.getHours()), null);
  return inView(first ?? DEFAULT_SCROLL_HOUR);
};

/** A time on the clock the format asks for: "9:30 AM", or "09:30". */
export const formatClock = (date: Date, locale: string | undefined, hour12: boolean) =>
  formatDate(date, locale, { hour: hour12 ? 'numeric' : '2-digit', minute: '2-digit', hour12 });

/** The current time in iOS's pill: the clock without AM or PM, which wouldn't fit. */
export const formatNowLabel = (now: Date, locale: string | undefined, hour12: boolean) =>
  formatClock(now, locale, hour12).replace(/^\D+|\D+$/gu, '');

/** An hour line's label: "9 AM" on a 12-hour clock, "09:00" on a 24-hour one. */
export const formatHourLabel = (hour: number, locale: string | undefined, hour12: boolean) => {
  const date = new Date(2021, 0, 1, hour % HOURS_PER_DAY);
  return hour12 ? formatDate(date, locale, { hour: 'numeric', hour12: true }) : formatClock(date, locale, false);
};

/** "9:00 AM – 10:00 AM", or the all-day label. */
export const formatEventTime = (
  { start, end, allDay }: { start: Date; end: Date; allDay: boolean },
  { locale, hour12, labels }: { locale?: string; hour12: boolean; labels: ScheduleLabels }
) => (allDay ? labels.allDay : `${formatClock(start, locale, hour12)} – ${formatClock(end, locale, hour12)}`);

export const resolveScheduleLabels = (labels?: Partial<ScheduleLabels>): ScheduleLabels => ({
  ...DEFAULT_SCHEDULE_LABELS,
  ...labels,
});

/** `color` laid over `background` at `alpha`, as one opaque color, so what's under an event doesn't show through its tint. */
export const blendColors = (color: string, background: string, alpha: number) => {
  const top = hexToRgb(color);
  const bottom = hexToRgb(background);
  return rgbToHex(top.map((c, i) => c * alpha + (bottom[i] ?? 0) * (1 - alpha)) as [number, number, number]);
};

const tint = (hex: string | null, theme: PickerTheme) => {
  if (!hex) return null;
  const alpha = theme.dark ? TINT_ALPHA.dark : TINT_ALPHA.light;
  const background = normalizeHex(theme.colors.background);
  return background ? blendColors(hex, background, alpha) : withAlpha(hex.slice(0, 7), alpha);
};

/** An event's colors: a tint of its color with a bar on iOS, a fill with text that reads on it in Material and on the web. */
export const getEventColors = (color: string | undefined, fill: EventFill, theme: PickerTheme): EventColors => {
  const hex = normalizeHex(color ?? theme.colors.primary);
  const base = color ?? theme.colors.primary;
  if (fill === EVENT_FILL.tint) {
    return {
      background: tint(hex, theme) ?? theme.colors.primaryMuted,
      text: theme.colors.text,
      bar: base,
    };
  }
  return {
    background: base,
    text: hex ? getCheckColor(hex) : theme.colors.onPrimary,
    bar: null,
  };
};

/** The part of an event on `day`, and whether it fills the day. */
const segmentOn = <T extends ScheduleEvent>(event: T, day: Date): { segment: EventSegment<T>; allDay: boolean } => {
  const dayStart = startOfDay(day).getTime();
  const nextDay = addDays(startOfDay(day), 1).getTime();
  const start = Math.max(event.start.getTime(), dayStart);
  const end = Math.min(event.end.getTime(), nextDay);
  return {
    segment: {
      event,
      start: new Date(start),
      end: new Date(Math.max(end, start)),
      continuesBefore: event.start.getTime() < dayStart,
      continuesAfter: event.end.getTime() > nextDay,
    },
    allDay: !!event.allDay || (start === dayStart && end === nextDay),
  };
};

/** The days an event is on: every day from its start to its end, the end's day left out when it ends at midnight. */
const eventDays = (event: ScheduleEvent) => {
  const first = startOfDay(event.start);
  const endsAtMidnight = !event.allDay && event.end > event.start && event.end.getTime() === startOfDay(event.end).getTime();
  const last = endsAtMidnight ? addDays(startOfDay(event.end), -1) : startOfDay(event.end);
  const days: Date[] = [];
  for (let day = first; compareDay(day, last) <= 0; day = addDays(day, 1)) days.push(day);
  return days.length ? days : [first];
};

/**
 * The agenda's rows, day by day: on iOS (`withHeaders`) a band for each day, then its events, all-day first; in Material
 * and on the web the events alone, the first of each day carrying the date. With `showEmptyDays`, the days between the
 * first and the last event that have nothing on get a "No events" row.
 */
export const buildAgendaRows = <T extends ScheduleEvent>(
  events: readonly T[],
  { withHeaders, showEmptyDays }: { withHeaders: boolean; showEmptyDays: boolean }
): AgendaRows<T> => {
  const byDay = new Map<string, { date: Date; items: { segment: EventSegment<T>; allDay: boolean }[] }>();
  for (const event of events) {
    for (const day of eventDays(event)) {
      const key = toDateKey(day);
      const entry = byDay.get(key) ?? { date: day, items: [] };
      entry.items.push(segmentOn(event, day));
      byDay.set(key, entry);
    }
  }
  let days = Array.from(byDay.values()).sort((a, b) => compareDay(a.date, b.date));
  const firstDay = days[0]?.date;
  const lastDay = days[days.length - 1]?.date;
  if (showEmptyDays && firstDay && lastDay) {
    const filled: typeof days = [];
    for (let day = firstDay; compareDay(day, lastDay) <= 0; day = addDays(day, 1)) {
      filled.push(byDay.get(toDateKey(day)) ?? { date: day, items: [] });
    }
    days = filled;
  }

  const rows: AgendaRow<T>[] = [];
  const headerIndices: number[] = [];
  const indexByDay: Record<string, number> = {};
  for (const { date, items } of days) {
    const dateKey = toDateKey(date);
    indexByDay[dateKey] = rows.length;
    if (withHeaders) {
      headerIndices.push(rows.length);
      rows.push({ kind: ROW_KIND.header, key: `${dateKey}:header`, date, dateKey, first: true, allDay: false });
    }
    if (!items.length) {
      rows.push({ kind: ROW_KIND.empty, key: `${dateKey}:empty`, date, dateKey, first: !withHeaders, allDay: false });
      continue;
    }
    const sorted = [...items].sort((a, b) => Number(b.allDay) - Number(a.allDay) || bySegmentStart(a.segment, b.segment));
    sorted.forEach(({ segment, allDay }, i) => {
      rows.push({
        kind: ROW_KIND.event,
        key: `${dateKey}:${segment.event.id}`,
        date,
        dateKey,
        first: !withHeaders && i === 0,
        segment,
        allDay,
      });
    });
  }
  return {
    rows,
    headerIndices,
    dayKeys: days.map((d) => toDateKey(d.date)),
    indexByDay,
  };
};

/** The day to scroll to for `dateKey`: that day, else the next day listed, else the last one. Null for an empty list. */
export const findAgendaDay = (dayKeys: string[], dateKey: string) => {
  return dayKeys.find((key) => key >= dateKey) ?? dayKeys[dayKeys.length - 1] ?? null;
};
