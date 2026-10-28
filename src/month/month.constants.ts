import type { Design } from '../core/theme/theme.types';
import type { MonthDisplay } from './month.types';

export const MONTH_DISPLAY = {
  wheel: 'wheel',
  grid: 'grid',
} as const;

/** iOS scrolls month and year wheels, as its date picker does for a month; Material and the web pick from a grid of months. */
export const MONTH_DISPLAY_DESIGN: Record<Design, MonthDisplay> = {
  ios: MONTH_DISPLAY.wheel,
  material: MONTH_DISPLAY.grid,
  web: MONTH_DISPLAY.grid,
};

/** Four rows of three, for the months and for a page of years. */
export const MONTH_GRID_HEIGHT = 224;
