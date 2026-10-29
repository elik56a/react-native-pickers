import { DIRECTION, KEY } from '../core.constants';
import type { Rect } from '../core.types';
import { keyboardProps, nearestInDirection, nextFocusIndex } from './keyboard.utils';

const SIZE = 40;
const cell = (column: number, row: number): Rect => ({
  left: column * SIZE,
  top: row * SIZE,
  right: (column + 1) * SIZE,
  bottom: (row + 1) * SIZE,
});

/** A 7-column calendar week, then the first 3 days of the next. */
const GRID = [...Array.from({ length: 7 }, (_, c) => cell(c, 0)), cell(0, 1), cell(1, 1), cell(2, 1)];
/** The same days as drawn right to left. */
const RTL_GRID = GRID.map(
  (r): Rect => ({
    ...r,
    left: 6 * SIZE - r.left,
    right: 7 * SIZE - r.left,
  })
);
const at = (index: number) => GRID[index] as Rect;
const SEARCH: Rect = { left: 0, top: -SIZE, right: 7 * SIZE, bottom: 0 };

describe('nearestInDirection', () => {
  it('keeps to the column going down and to the row going right', () => {
    expect(nearestInDirection(at(1), GRID, DIRECTION.down, 1)).toBe(8);
    expect(nearestInDirection(at(1), GRID, DIRECTION.right, 1)).toBe(2);
    expect(nearestInDirection(at(8), GRID, DIRECTION.up, 8)).toBe(1);
    expect(nearestInDirection(at(8), GRID, DIRECTION.left, 8)).toBe(7);
  });

  it('finds nothing past the edge, and skips empty boxes', () => {
    expect(nearestInDirection(at(1), GRID, DIRECTION.up, 1)).toBe(-1);
    expect(nearestInDirection(at(0), [at(0), { left: 0, top: 40, right: 0, bottom: 40 }], DIRECTION.down, 0)).toBe(-1);
  });
});

describe('nextFocusIndex', () => {
  it('wraps left and right to the next row, mirrored in RTL', () => {
    expect(nextFocusIndex(KEY.right, 6, GRID, false)).toBe(7);
    expect(nextFocusIndex(KEY.left, 7, GRID, false)).toBe(6);
    expect(nextFocusIndex(KEY.left, 6, RTL_GRID, true)).toBe(7);
    expect(nextFocusIndex(KEY.left, 2, RTL_GRID, true)).toBe(3);
  });

  it('goes to the first and last with Home and End', () => {
    expect(nextFocusIndex(KEY.home, 5, GRID, false)).toBe(0);
    expect(nextFocusIndex(KEY.end, 5, GRID, false)).toBe(GRID.length - 1);
  });

  it('leaves a text field its left, right, Home and End, and goes between it and the grid', () => {
    const withSearch = [SEARCH, ...GRID];
    expect(nextFocusIndex(KEY.down, 0, withSearch, false, true)).toBe(1);
    expect(nextFocusIndex(KEY.left, 0, withSearch, false, true)).toBe(-1);
    expect(nextFocusIndex(KEY.home, 0, withSearch, false, true)).toBe(-1);
    expect(nextFocusIndex(KEY.up, 4, withSearch, false)).toBe(0);
  });

  it('ignores other keys', () => {
    expect(nextFocusIndex('a', 0, GRID, false)).toBe(-1);
  });
});

describe('keyboardProps', () => {
  const press = (key: string, handlers: Parameters<typeof keyboardProps>[0]) => {
    const event = { nativeEvent: { key }, preventDefault: jest.fn(), stopPropagation: jest.fn() };
    keyboardProps(handlers).onKeyDown(event as unknown as Parameters<ReturnType<typeof keyboardProps>['onKeyDown']>[0]);
    return event;
  };

  it('runs the handler and keeps the key from scrolling the page or moving focus', () => {
    const up = jest.fn();
    const event = press(KEY.up, { [KEY.up]: up });
    expect(up).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('lets keys it has no handler for through', () => {
    const event = press(KEY.left, { [KEY.up]: jest.fn() });
    expect(event.preventDefault).not.toHaveBeenCalled();
  });
});
