import { CALENDAR_VIEW, YEARS_PER_PAGE } from '../calendar/calendar.constants';
import type { CalendarView, QuickCell } from '../calendar/calendar.types';
import { getMonthCells, getYearCells, getYearPageStart } from '../calendar/calendar.utils';
import { getMonthNames } from '../core/utils/date.utils';
import { DATE_PART } from '../date/date.constants';
import { getLocaleDateOrder } from '../date/date.utils';

/** Month and year wheels in the order the locale writes them: month first in English, year first in Japanese. */
export const getMonthOrder = (locale?: string) => getLocaleDateOrder(locale).filter((part) => part !== DATE_PART.day);

/** The 12 months of `year`, the value's one chosen only in its own year. */
export const getMonthGridCells = (year: number, value: Date, locale?: string, minDate?: Date, maxDate?: Date): QuickCell[] =>
  getMonthCells(new Date(year, value.getMonth(), 1), getMonthNames(locale, 'short'), minDate, maxDate).map((cell) => ({
    ...cell,
    selected: cell.selected && year === value.getFullYear(),
  }));

/** The page of years holding `year`, the value's year chosen. */
export const getYearGridCells = (year: number, value: Date, bounds: [number, number]): QuickCell[] =>
  getYearCells(new Date(year, 0, 1), bounds).map((cell) => ({
    ...cell,
    selected: cell.value === value.getFullYear(),
  }));

/** The year an arrow goes to: the next or previous year in the month grid, a page of years in the year grid. */
export const shiftGridYear = (view: CalendarView, year: number, delta: number) =>
  year + delta * (view === CALENDAR_VIEW.years ? YEARS_PER_PAGE : 1);

/** An arrow works while the year, or some year on the page, it goes to is within the bounds. */
export const canShiftGridYear = (view: CalendarView, year: number, delta: number, [minYear, maxYear]: [number, number]) => {
  const target = shiftGridYear(view, year, delta);
  if (view !== CALENDAR_VIEW.years) return target >= minYear && target <= maxYear;
  const start = getYearPageStart(target);
  return start <= maxYear && start + YEARS_PER_PAGE - 1 >= minYear;
};
