import { lightTheme } from '../core/theme/theme.constants';
import { DEFAULT_SCHEDULE_LABELS, EVENT_FILL, HOUR_MS, ROW_KIND } from './schedule.constants';
import type { ScheduleEvent } from './schedule.types';
import {
  blendColors,
  buildAgendaRows,
  findAgendaDay,
  formatEventTime,
  formatHourLabel,
  formatNowLabel,
  getAllDayEvents,
  getDaySegments,
  getEventColors,
  getHours,
  getInitialScrollHour,
  getNowOffset,
  getSegmentFrame,
  getSlotAt,
  getTimelineDays,
  layoutSegments,
  resolveHours,
  resolveNumberOfDays,
  resolveScheduleLabels,
} from './schedule.utils';

const at = (day: number, hour: number, minute = 0) => new Date(2026, 10, day, hour, minute);
const event = (id: string, start: Date, end: Date, extra: Partial<ScheduleEvent> = {}): ScheduleEvent => ({
  id,
  title: id,
  start,
  end,
  ...extra,
});
const ids = (list: { event: ScheduleEvent }[]) => list.map((s) => s.event.id);
const layoutOf = (events: ScheduleEvent[], minDurationMs = 0) =>
  Object.fromEntries(
    layoutSegments(getDaySegments(events, at(9, 0)), minDurationMs).map((s) => [s.event.id, [s.column, s.columns, s.span]])
  );

describe('resolveHours and resolveNumberOfDays', () => {
  it('keeps the window inside the day, at least an hour long', () => {
    expect(resolveHours()).toEqual([0, 24]);
    expect(resolveHours(7, 20)).toEqual([7, 20]);
    expect(resolveHours(-3, 30)).toEqual([0, 24]);
    expect(resolveHours(10, 10)).toEqual([10, 11]);
  });

  it('shows 1 to 7 days', () => {
    expect(resolveNumberOfDays()).toBe(1);
    expect(resolveNumberOfDays(3)).toBe(3);
    expect(resolveNumberOfDays(0)).toBe(1);
    expect(resolveNumberOfDays(12)).toBe(7);
  });

  it('lists the days and the hour lines', () => {
    expect(getTimelineDays(at(9, 15), 3)).toEqual([at(9, 0), at(10, 0), at(11, 0)]);
    expect(getHours(8, 11)).toEqual([8, 9, 10, 11]);
  });
});

describe('getDaySegments', () => {
  it("keeps the day's timed events, oldest first, and leaves all-day ones out", () => {
    const events = [
      event('b', at(9, 13), at(9, 14)),
      event('a', at(9, 9), at(9, 10)),
      event('other day', at(10, 9), at(10, 10)),
      event('all day', at(9, 0), at(9, 0), { allDay: true }),
    ];
    expect(ids(getDaySegments(events, at(9, 0)))).toEqual(['a', 'b']);
  });

  it('cuts an event that runs over midnight at each end, and says where it goes on', () => {
    const overnight = event('night', at(9, 22), at(10, 2));
    const [first] = getDaySegments([overnight], at(9, 0));
    expect(first).toMatchObject({ start: at(9, 22), end: at(10, 0), continuesBefore: false, continuesAfter: true });
    const [second] = getDaySegments([overnight], at(10, 0));
    expect(second).toMatchObject({ start: at(10, 0), end: at(10, 2), continuesBefore: true, continuesAfter: false });
  });

  it('cuts to the hours drawn, and drops events outside them', () => {
    const events = [event('early', at(9, 6), at(9, 9)), event('dawn', at(9, 5), at(9, 6))];
    const segments = getDaySegments(events, at(9, 0), 8, 20);
    expect(ids(segments)).toEqual(['early']);
    expect(segments[0]).toMatchObject({ start: at(9, 8), end: at(9, 9) });
  });

  it('keeps an event with no length, at its start', () => {
    expect(ids(getDaySegments([event('reminder', at(9, 9), at(9, 9))], at(9, 0)))).toEqual(['reminder']);
  });
});

describe('getAllDayEvents', () => {
  it('finds the all-day events that cover the day, both ends included', () => {
    const trip = event('trip', at(8, 0), at(10, 0), { allDay: true });
    const timed = event('timed', at(9, 9), at(9, 10));
    expect(ids(getAllDayEvents([trip, timed], at(10, 0)).map((e) => ({ event: e })))).toEqual(['trip']);
    expect(getAllDayEvents([trip], at(11, 0))).toEqual([]);
  });
});

describe('layoutSegments', () => {
  it('gives events that never overlap the whole width', () => {
    expect(layoutOf([event('a', at(9, 9), at(9, 10)), event('b', at(9, 10), at(9, 11))])).toEqual({
      a: [0, 1, 1],
      b: [0, 1, 1],
    });
  });

  it('puts overlapping events side by side', () => {
    expect(layoutOf([event('a', at(9, 9), at(9, 11)), event('b', at(9, 10), at(9, 12))])).toEqual({
      a: [0, 2, 1],
      b: [1, 2, 1],
    });
  });

  it('reuses a column once it frees up, and widens an event into the columns free beside it', () => {
    const events = [
      event('a', at(9, 9), at(9, 12)),
      event('b', at(9, 9), at(9, 10)),
      event('c', at(9, 9, 30), at(9, 10, 30)),
      event('d', at(9, 10, 30), at(9, 11)),
    ];
    // a | b | c, then d takes b's column after b ends and widens into c's once c ends.
    expect(layoutOf(events)).toEqual({
      a: [0, 3, 1],
      b: [1, 3, 1],
      c: [2, 3, 1],
      d: [1, 3, 2],
    });
  });

  it('counts a short event drawn taller as overlapping the one under it', () => {
    const events = [event('a', at(9, 9), at(9, 9, 5)), event('b', at(9, 9, 10), at(9, 10))];
    expect(layoutOf(events)).toEqual({ a: [0, 1, 1], b: [0, 1, 1] });
    expect(layoutOf(events, 20 * 60_000)).toEqual({ a: [0, 2, 1], b: [1, 2, 1] });
  });
});

describe('getSegmentFrame', () => {
  const options = { startHour: 0, hourHeight: 60, minHeight: 20 };

  it('places a segment by its start and sizes it by its length', () => {
    expect(getSegmentFrame({ start: at(9, 9, 30), end: at(9, 11) }, options)).toEqual({ top: 570, height: 90 });
    expect(getSegmentFrame({ start: at(9, 9, 30), end: at(9, 11) }, { ...options, startHour: 8 })).toEqual({ top: 90, height: 90 });
  });

  it('draws a short segment at the least height, and one cut at midnight to the bottom', () => {
    expect(getSegmentFrame({ start: at(9, 9), end: at(9, 9, 5) }, options).height).toBe(20);
    expect(getSegmentFrame({ start: at(9, 23), end: at(10, 0) }, options)).toEqual({ top: 1380, height: 60 });
  });
});

describe('getSlotAt', () => {
  const options = { startHour: 8, endHour: 20, hourHeight: 60, snapMinutes: 30 };

  it('starts an hour-long slot where the column was tapped, snapped down', () => {
    expect(getSlotAt(at(9, 0), 100, options)).toEqual({ start: at(9, 9, 30), end: at(9, 10, 30) });
    expect(getSlotAt(at(9, 0), 100, { ...options, snapMinutes: 15 })).toEqual({ start: at(9, 9, 30), end: at(9, 10, 30) });
    expect(getSlotAt(at(9, 0), 95, { ...options, snapMinutes: 15 }).start).toEqual(at(9, 9, 30));
    expect(getSlotAt(at(9, 0), 80, { ...options, snapMinutes: 15 }).start).toEqual(at(9, 9, 15));
  });

  it('keeps the slot inside the hours drawn', () => {
    expect(getSlotAt(at(9, 0), -40, options).start).toEqual(at(9, 8));
    expect(getSlotAt(at(9, 0), 5000, options).start).toEqual(at(9, 19, 30));
  });
});

describe('getNowOffset', () => {
  it('measures now from the top, and is null outside the hours drawn', () => {
    expect(getNowOffset(at(9, 10, 30), 0, 24, 60)).toBe(630);
    expect(getNowOffset(at(9, 10, 30), 8, 20, 60)).toBe(150);
    expect(getNowOffset(at(9, 7), 8, 20, 60)).toBeNull();
    expect(getNowOffset(at(9, 21), 8, 20, 60)).toBeNull();
  });
});

describe('getInitialScrollHour', () => {
  const now = at(9, 14, 20);

  it('opens an hour before now when today is shown', () => {
    expect(getInitialScrollHour({ days: [at(9, 0)], events: [], now, startHour: 0, endHour: 24 })).toBe(13);
  });

  it('else opens at the first timed event, else at 8', () => {
    const events = [event('late', at(12, 15), at(12, 16)), event('early', at(12, 6), at(12, 7))];
    expect(getInitialScrollHour({ days: [at(12, 0)], events, now, startHour: 0, endHour: 24 })).toBe(6);
    expect(getInitialScrollHour({ days: [at(13, 0)], events, now, startHour: 0, endHour: 24 })).toBe(8);
  });

  it('stays inside the hours drawn', () => {
    expect(getInitialScrollHour({ days: [at(13, 0)], events: [], now, startHour: 10, endHour: 18 })).toBe(10);
    expect(getInitialScrollHour({ days: [at(9, 0)], events: [], now: at(9, 23), startHour: 8, endHour: 18 })).toBe(17);
  });
});

describe('formatting', () => {
  it('labels hours on a 12- or 24-hour clock', () => {
    expect(formatHourLabel(9, 'en-US', true)).toBe('9 AM');
    expect(formatHourLabel(0, 'en-US', true)).toBe('12 AM');
    expect(formatHourLabel(24, 'en-US', true)).toBe('12 AM');
    expect(formatHourLabel(9, 'en-GB', false)).toBe('09:00');
  });

  it("writes an event's times, or the all-day label", () => {
    const options = { locale: 'en-US', hour12: true, labels: DEFAULT_SCHEDULE_LABELS };
    expect(formatEventTime({ start: at(9, 9), end: at(9, 10, 30), allDay: false }, options)).toBe('9:00 AM – 10:30 AM');
    expect(formatEventTime({ start: at(9, 9), end: at(9, 10), allDay: true }, options)).toBe('All day');
    expect(formatEventTime({ start: at(9, 9), end: at(9, 10), allDay: false }, { ...options, hour12: false, locale: 'en-GB' })).toBe(
      '09:00 – 10:00'
    );
  });

  it("writes now's pill without the day period", () => {
    expect(formatNowLabel(at(9, 14, 5), 'en-US', true)).toBe('2:05');
    expect(formatNowLabel(at(9, 14, 5), 'en-GB', false)).toBe('14:05');
  });

  it('fills in the labels not given', () => {
    expect(resolveScheduleLabels({ allDay: 'Ganztägig' })).toEqual({ allDay: 'Ganztägig', noEvents: 'No events' });
  });
});

describe('getEventColors', () => {
  it('tints the color with a bar on iOS, laid over the background so nothing shows through', () => {
    const white = { ...lightTheme, colors: { ...lightTheme.colors, background: '#FFFFFF' } };
    expect(getEventColors('#2E7D32', EVENT_FILL.tint, white)).toEqual({
      background: blendColors('#2E7D32', '#FFFFFF', 0.18),
      text: lightTheme.colors.text,
      bar: '#2E7D32',
    });
  });

  it('keeps a see-through tint when the background is not hex', () => {
    const clear = { ...lightTheme, colors: { ...lightTheme.colors, background: 'transparent' } };
    expect(getEventColors('#2E7D32', EVENT_FILL.tint, clear).background).toBe('#2E7D322E');
  });

  it('blends a color over a background', () => {
    expect(blendColors('#000000', '#FFFFFF', 0.5)).toBe('#808080');
    expect(blendColors('#FF0000', '#0000FF', 1)).toBe('#FF0000');
  });

  it('fills with the color and text that reads on it in Material and on the web', () => {
    expect(getEventColors('#1A237E', EVENT_FILL.solid, lightTheme)).toMatchObject({ background: '#1A237E', text: '#FFFFFF', bar: null });
    expect(getEventColors('#FFEB3B', EVENT_FILL.solid, lightTheme).text).toBe('#17150F');
  });

  it("falls back to the theme's primary, and copes with a color that isn't hex", () => {
    expect(getEventColors(undefined, EVENT_FILL.solid, lightTheme).background).toBe(lightTheme.colors.primary);
    expect(getEventColors('tomato', EVENT_FILL.tint, lightTheme)).toMatchObject({
      background: lightTheme.colors.primaryMuted,
      bar: 'tomato',
    });
    expect(getEventColors('tomato', EVENT_FILL.solid, lightTheme).text).toBe(lightTheme.colors.onPrimary);
  });
});

describe('buildAgendaRows', () => {
  const events = [
    event('lunch', at(9, 12), at(9, 13)),
    event('standup', at(9, 9), at(9, 9, 15)),
    event('trip', at(9, 0), at(10, 0), { allDay: true }),
    event('review', at(12, 15), at(12, 16)),
  ];

  it('gives each day a band on iOS, then its events with the all-day ones first', () => {
    const { rows, headerIndices, dayKeys, indexByDay } = buildAgendaRows(events, { withHeaders: true, showEmptyDays: false });
    expect(rows.map((r) => (r.kind === ROW_KIND.event ? r.segment?.event.id : r.kind))).toEqual([
      'header',
      'trip',
      'standup',
      'lunch',
      'header',
      'trip',
      'header',
      'review',
    ]);
    expect(headerIndices).toEqual([0, 4, 6]);
    expect(dayKeys).toEqual(['2026-11-09', '2026-11-10', '2026-11-12']);
    expect(indexByDay).toEqual({ '2026-11-09': 0, '2026-11-10': 4, '2026-11-12': 6 });
    expect(rows[1]?.allDay).toBe(true);
  });

  it('puts the date on the first event of each day in Material and on the web', () => {
    const { rows, headerIndices } = buildAgendaRows(events, { withHeaders: false, showEmptyDays: false });
    expect(headerIndices).toEqual([]);
    expect(rows.map((r) => r.first)).toEqual([true, false, false, true, true]);
  });

  it('lists the empty days in between with showEmptyDays', () => {
    const { rows, dayKeys } = buildAgendaRows(events, { withHeaders: false, showEmptyDays: true });
    expect(dayKeys).toEqual(['2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12']);
    expect(rows.find((r) => r.dateKey === '2026-11-11')).toMatchObject({ kind: ROW_KIND.empty, first: true });
  });

  it('lists an event over midnight on both days, and one ending at midnight on its day alone', () => {
    const overnight = event('night', at(9, 22), at(10, 2));
    const evening = event('evening', at(9, 20), at(10, 0));
    const { rows } = buildAgendaRows([overnight, evening], { withHeaders: false, showEmptyDays: false });
    expect(rows.map((r) => `${r.dateKey} ${r.segment?.event.id}`)).toEqual(['2026-11-09 evening', '2026-11-09 night', '2026-11-10 night']);
    expect(rows[2]?.segment).toMatchObject({ start: at(10, 0), end: at(10, 2), continuesBefore: true });
  });

  it('counts a timed event that fills the whole day as all day', () => {
    const { rows } = buildAgendaRows([event('shift', at(9, 0), at(11, 0))], { withHeaders: false, showEmptyDays: false });
    expect(rows.map((r) => r.allDay)).toEqual([true, true]);
    expect((rows[0]?.segment?.end.getTime() ?? 0) - (rows[0]?.segment?.start.getTime() ?? 0)).toBe(24 * HOUR_MS);
  });
});

describe('findAgendaDay', () => {
  it('finds the day, else the next one listed, else the last', () => {
    const keys = ['2026-11-09', '2026-11-12'];
    expect(findAgendaDay(keys, '2026-11-09')).toBe('2026-11-09');
    expect(findAgendaDay(keys, '2026-11-10')).toBe('2026-11-12');
    expect(findAgendaDay(keys, '2026-12-01')).toBe('2026-11-12');
    expect(findAgendaDay(keys, '2026-01-01')).toBe('2026-11-09');
    expect(findAgendaDay([], '2026-11-09')).toBeNull();
  });
});
