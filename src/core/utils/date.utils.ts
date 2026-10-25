/** Pure date helpers. All operate in local time and never mutate inputs. */

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
export const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

export const addMonths = (d: Date, months: number): Date => {
  const target = new Date(d.getFullYear(), d.getMonth() + months, 1);
  const day = Math.min(d.getDate(), daysInMonth(target.getFullYear(), target.getMonth()));
  return new Date(target.getFullYear(), target.getMonth(), day, d.getHours(), d.getMinutes(), d.getSeconds());
};

export const addDays = (d: Date, days: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + days, d.getHours(), d.getMinutes());

export const isSameDay = (a?: Date | null, b?: Date | null) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const isSameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

export const compareDay = (a: Date, b: Date) => startOfDay(a).getTime() - startOfDay(b).getTime();

export const isBetweenDays = (d: Date, start?: Date | null, end?: Date | null) => {
  if (!start || !end) return false;
  const t = startOfDay(d).getTime();
  return t > startOfDay(start).getTime() && t < startOfDay(end).getTime();
};

export const isOutOfRange = (d: Date, min?: Date | null, max?: Date | null) => {
  return (!!min && compareDay(d, min) < 0) || (!!max && compareDay(d, max) > 0);
};

export const clampDate = (d: Date, min?: Date | null, max?: Date | null) => {
  if (min && d.getTime() < min.getTime()) return new Date(min);
  if (max && d.getTime() > max.getTime()) return new Date(max);
  return d;
};

/** `YYYY-MM-DD` key in local time. */
export const toDateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/**
 * 6x7 (or fewer rows) grid of dates for a month view.
 * `firstDayOfWeek`: 0 = Sunday ... 6 = Saturday.
 */
export const buildMonthGrid = (year: number, month: number, firstDayOfWeek = 0, fixedWeeks = true): Date[][] => {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() - firstDayOfWeek + 7) % 7;
  const count = daysInMonth(year, month);
  const weeks = fixedWeeks ? 6 : Math.ceil((lead + count) / 7);
  const grid: Date[][] = [];
  for (let w = 0; w < weeks; w++) {
    const row: Date[] = [];
    for (let i = 0; i < 7; i++) row.push(new Date(year, month, 1 - lead + w * 7 + i));
    grid.push(row);
  }
  return grid;
};

const fmtCache = new Map<string, Intl.DateTimeFormat>();
const fmt = (locale: string | undefined, opts: Intl.DateTimeFormatOptions) => {
  const key = `${locale ?? ''}|${JSON.stringify(opts)}`;
  let f = fmtCache.get(key);
  if (!f) {
    try {
      f = new Intl.DateTimeFormat(locale, opts);
    } catch {
      f = new Intl.DateTimeFormat('en-US', opts);
    }
    fmtCache.set(key, f);
  }
  return f;
};

const EN_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const EN_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const safe = <T>(fn: () => T, fallback: T): T => {
  try {
    const v = fn();
    return v ?? fallback;
  } catch {
    return fallback;
  }
};

export const getMonthNames = (locale?: string, width: 'long' | 'short' = 'long'): string[] => {
  return EN_MONTHS.map((en, m) =>
    safe(() => fmt(locale, { month: width }).format(new Date(2021, m, 1)), width === 'long' ? en : en.slice(0, 3))
  );
};

/** Weekday names indexed by JS day (0 = Sunday). */
export const getWeekdayNames = (locale?: string, width: 'long' | 'short' | 'narrow' = 'short'): string[] => {
  // 2021-08-01 is a Sunday
  return EN_DAYS.map((en, i) => safe(() => fmt(locale, { weekday: width }).format(new Date(2021, 7, 1 + i)), en));
};

export const formatMonthYear = (d: Date, locale?: string) => {
  return safe(() => fmt(locale, { month: 'long', year: 'numeric' }).format(d), `${EN_MONTHS[d.getMonth()]} ${d.getFullYear()}`);
};

export const formatDate = (
  d: Date,
  locale?: string,
  opts: Intl.DateTimeFormatOptions = { dateStyle: 'medium' } as Intl.DateTimeFormatOptions
) => {
  return safe(() => fmt(locale, opts).format(d), toDateKey(d));
};

/** True when the locale prefers a 12-hour clock. */
export const uses12HourClock = (locale?: string): boolean => {
  return safe(() => {
    const parts = fmt(locale, { hour: 'numeric' }).formatToParts(new Date(2021, 0, 1, 15));
    return parts.some((p) => p.type === 'dayPeriod');
  }, false);
};

/** Not yet in TS's lib typings: `getWeekInfo()` is the current spec, `weekInfo` the older getter some engines ship. */
interface LocaleWeekInfo {
  getWeekInfo?: () => { firstDay: number };
  weekInfo?: { firstDay: number };
}

/** Best-effort first day of week from the locale (Intl.Locale weekInfo). */
export const getFirstDayOfWeek = (locale?: string): number => {
  return safe(() => {
    if (!Intl.Locale || !locale) return 0;
    const loc: Intl.Locale & LocaleWeekInfo = new Intl.Locale(locale);
    const info = loc.getWeekInfo?.() ?? loc.weekInfo;
    if (!info?.firstDay) return 0;
    return info.firstDay % 7; // Intl uses 1 = Monday ... 7 = Sunday
  }, 0);
};

export const getDayPeriods = (locale?: string): [string, string] => {
  const get = (h: number, fb: string) =>
    safe(
      () =>
        fmt(locale, { hour: 'numeric', hour12: true })
          .formatToParts(new Date(2021, 0, 1, h))
          .find((p) => p.type === 'dayPeriod')?.value ?? fb,
      fb
    );
  return [get(9, 'AM'), get(15, 'PM')];
};
