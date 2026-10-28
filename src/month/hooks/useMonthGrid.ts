import { useEffect, useMemo, useState } from 'react';

import { ARROW_DIRECTION, CALENDAR_VIEW } from '../../calendar/calendar.constants';
import type { ArrowDirection } from '../../calendar/calendar.types';
import { getHeaderLabel, getYearBounds } from '../../calendar/calendar.utils';
import type { MonthGridProps } from '../month.types';
import { canShiftGridYear, getMonthGridCells, getYearGridCells, shiftGridYear } from '../month.utils';

type GridView = typeof CALENDAR_VIEW.months | typeof CALENDAR_VIEW.years;

const toDelta = (direction: ArrowDirection) => (direction === ARROW_DIRECTION.prev ? -1 : 1);

/** The year shown, the months or the page of years, and the arrows and taps that move between them. */
export const useMonthGrid = ({ value, onChange, locale, minDate, maxDate, yearRange }: MonthGridProps) => {
  const [year, setYear] = useState(value.getFullYear());
  const [view, setView] = useState<GridView>(CALENDAR_VIEW.months);
  const bounds = useMemo(() => getYearBounds(new Date(), yearRange, minDate, maxDate), [maxDate, minDate, yearRange]);

  // A value set from outside shows its year.
  const valueYear = value.getFullYear();
  useEffect(() => setYear(valueYear), [valueYear]);

  const years = view === CALENDAR_VIEW.years;
  return {
    view,
    title: getHeaderLabel(view, new Date(year, 0, 1), ''),
    cells: years ? getYearGridCells(year, value, bounds) : getMonthGridCells(year, value, locale, minDate, maxDate),
    isArrowDisabled: (direction: ArrowDirection) => !canShiftGridYear(view, year, toDelta(direction), bounds),
    onArrowPress: (direction: ArrowDirection) => setYear(shiftGridYear(view, year, toDelta(direction))),
    toggleView: () => setView(years ? CALENDAR_VIEW.months : CALENDAR_VIEW.years),
    select: (cell: number) => {
      if (!years) return onChange(new Date(year, cell, 1));
      setYear(cell);
      setView(CALENDAR_VIEW.months);
    },
  };
};
