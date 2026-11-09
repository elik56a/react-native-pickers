import type { Design } from '../core/theme/theme.types';
import type { ScheduleDesign, ScheduleLabels } from './schedule.types';

export const MINUTES_PER_HOUR = 60;
export const HOURS_PER_DAY = 24;
export const MINUTE_MS = 60_000;
export const HOUR_MS = MINUTE_MS * MINUTES_PER_HOUR;

/** The most days a timeline shows side by side: a week. */
export const MAX_TIMELINE_DAYS = 7;

export const DEFAULT_HOUR_HEIGHT = 60;
/** Where a timeline opens when today isn't shown and the days shown have no timed event. */
export const DEFAULT_SCROLL_HOUR = 8;
/** A tap on the grid snaps the new event's start down to this many minutes. */
export const DEFAULT_SNAP_MINUTES = 30;
/** How long the event a tap on the grid suggests lasts. */
export const NEW_EVENT_MINUTES = 60;
/** An event this short or shorter still draws this tall, so its title shows. */
export const MIN_EVENT_HEIGHT = 20;
/** Room above and below the hours, so the first and last hour labels, centred on their lines, aren't cut off. */
export const GRID_PADDING = 10;
export const HOUR_LABEL_HEIGHT = 16;
export const GUTTER_WIDTH = 56;
/** The gap between events side by side, and under each one. */
export const EVENT_GAP = 2;
/** The text lines an event needs before its time and subtitle show under the title. */
export const EVENT_LINE_HEIGHT = 16;
/** An event narrower than this share of the grid shows its title on one line and nothing else, rather than breaking words. */
export const COMPACT_EVENT_WIDTH = 0.3;
export const ALL_DAY_CHIP_HEIGHT = 22;
export const NOW_DOT_SIZE = 10;
export const DAY_HEADER_NUMBER_SIZE = 28;
export const NOW_LINE_WIDTH = 2;
export const IOS_EVENT_BAR_WIDTH = 3;

/** After the agenda scrolls to `selectedDate`, the days it scrolls past aren't reported for this long. */
export const SCROLL_SETTLE_MS = 600;
/** The pause before a scroll to a row that isn't laid out yet tries again. */
export const SCROLL_RETRY_MS = 50;

export const AGENDA_TIME_WIDTH = 76;
export const AGENDA_DATE_WIDTH = { cards: 64, rows: 112 } as const;
/** The times column of the web's rows, so the titles line up. */
export const AGENDA_LINE_TIME_WIDTH = 124;
export const AGENDA_DAY_NUMBER_SIZE = 36;
export const AGENDA_DOT_SIZE = 10;
export const AGENDA_BAR_WIDTH = 4;

/** iOS tints an event with its colour; Material and the web fill it. */
export const EVENT_FILL = {
  tint: 'tint',
  solid: 'solid',
} as const;

/** iOS shows the time in a pill in the hour column; Google Calendar puts a dot where the line starts. */
export const NOW_MARKER = {
  time: 'time',
  dot: 'dot',
} as const;

/**
 * iOS Calendar's list: a band per day that sticks to the top, then rows with the times on the left and a coloured bar.
 * Google Calendar's schedule on Android: the date on the left and a filled card per event. Google Calendar on the web:
 * the date on the left and a compact row per event, with a dot, the time and the title.
 */
export const AGENDA_LAYOUT = {
  list: 'list',
  cards: 'cards',
  rows: 'rows',
} as const;

/** How a tint sits on the background: stronger in dark mode, where a light tint would vanish. */
export const TINT_ALPHA = { light: 0.18, dark: 0.32 } as const;

export const SCHEDULE_DESIGN: Record<Design, ScheduleDesign> = {
  ios: {
    eventFill: EVENT_FILL.tint,
    nowMarker: NOW_MARKER.time,
    labelEnds: true,
    inlineDayHeader: true,
    agendaLayout: AGENDA_LAYOUT.list,
    uppercaseWeekdays: false,
  },
  material: {
    eventFill: EVENT_FILL.solid,
    nowMarker: NOW_MARKER.dot,
    labelEnds: false,
    inlineDayHeader: false,
    agendaLayout: AGENDA_LAYOUT.cards,
    uppercaseWeekdays: false,
  },
  web: {
    eventFill: EVENT_FILL.solid,
    nowMarker: NOW_MARKER.dot,
    labelEnds: false,
    inlineDayHeader: false,
    agendaLayout: AGENDA_LAYOUT.rows,
    uppercaseWeekdays: true,
  },
};

export const DEFAULT_SCHEDULE_LABELS: ScheduleLabels = {
  allDay: 'All day',
  noEvents: 'No events',
};

export const ROW_KIND = {
  header: 'header',
  event: 'event',
  empty: 'empty',
} as const;
