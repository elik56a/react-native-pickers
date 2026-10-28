import { canShiftGridYear, getMonthGridCells, getMonthOrder, getYearGridCells, shiftGridYear } from './month.utils';

const oct2026 = new Date(2026, 9, 1);

describe('getMonthOrder', () => {
  it('drops the day from the locale order', () => {
    expect(getMonthOrder('en-US')).toEqual(['month', 'year']);
    expect(getMonthOrder('ja-JP')).toEqual(['year', 'month']);
  });
});

describe('getMonthGridCells', () => {
  it('chooses the value month only in its own year, and disables months outside min/max', () => {
    const cells = getMonthGridCells(2026, oct2026, 'en-US', new Date(2026, 2, 15));
    expect(cells.map((c) => c.label).slice(0, 3)).toEqual(['Jan', 'Feb', 'Mar']);
    expect(cells.filter((c) => c.selected).map((c) => c.value)).toEqual([9]);
    expect(cells.filter((c) => c.disabled).map((c) => c.value)).toEqual([0, 1]);
    expect(getMonthGridCells(2027, oct2026, 'en-US').some((c) => c.selected)).toBe(false);
  });
});

describe('getYearGridCells', () => {
  it("shows the year's page and chooses the value year", () => {
    const cells = getYearGridCells(2030, oct2026, [2000, 2100]);
    expect(cells[0]?.value).toBe(2028);
    expect(cells.some((c) => c.selected)).toBe(false);
    expect(getYearGridCells(2026, oct2026, [2000, 2100]).find((c) => c.selected)?.value).toBe(2026);
  });
});

describe('year arrows', () => {
  it('move by a year over months and by a page over years, while there is something to show', () => {
    expect(shiftGridYear('months', 2026, 1)).toBe(2027);
    expect(shiftGridYear('years', 2026, -1)).toBe(2014);
    expect(canShiftGridYear('months', 2026, 1, [2000, 2026])).toBe(false);
    expect(canShiftGridYear('years', 2026, 1, [2000, 2030])).toBe(true);
    expect(canShiftGridYear('years', 2026, 1, [2000, 2035])).toBe(true);
    expect(canShiftGridYear('years', 2026, -1, [2024, 2100])).toBe(false);
  });
});
