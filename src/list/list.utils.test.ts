import { findItemIndex, getHiddenSides, getPageOffset, getRevealOffset } from './list.utils';

/** Five 80px items, 8px apart. */
const layouts = [0, 88, 176, 264, 352].map((x) => ({
  x,
  width: 80,
}));
const frame = (offset: number, width = 200) => ({
  offset,
  width,
  contentWidth: 432,
});

describe('getRevealOffset', () => {
  it('scrolls the hidden next item into view, with a peek past it', () => {
    expect(getRevealOffset(layouts, 1, frame(0), 16)).toBe(72);
  });

  it('scrolls back to reveal the hidden previous item', () => {
    expect(getRevealOffset(layouts, 3, frame(232), 16)).toBe(160);
  });

  it('does nothing when the neighbors already show', () => {
    expect(getRevealOffset(layouts, 1, frame(0, 432), 16)).toBeNull();
  });

  it('stays inside the content at either end', () => {
    expect(getRevealOffset(layouts, 4, frame(150), 16)).toBe(232);
    expect(getRevealOffset(layouts, 0, frame(40), 16)).toBe(0);
  });

  it('keeps the pressed item in view when its neighbor does not fit', () => {
    expect(getRevealOffset(layouts, 2, frame(0, 120), 16)).toBe(160);
  });

  it('waits until the list and the item are measured', () => {
    expect(getRevealOffset([], 0, frame(0), 16)).toBeNull();
    expect(getRevealOffset(layouts, 1, frame(0, 0), 16)).toBeNull();
  });
});

describe('findItemIndex', () => {
  const items = ['a', 'b'].map((value) => ({ value }));
  it('finds the item holding the value, -1 for none', () => {
    expect(findItemIndex(items, 'b', Object.is)).toBe(1);
    expect(findItemIndex(items, 'z', Object.is)).toBe(-1);
    expect(findItemIndex(items, null, Object.is)).toBe(-1);
  });
});

describe('getHiddenSides', () => {
  it('shows a side while content is hidden past it', () => {
    expect(getHiddenSides(frame(0))).toEqual({ left: false, right: true });
    expect(getHiddenSides(frame(100))).toEqual({ left: true, right: true });
    expect(getHiddenSides(frame(232))).toEqual({ left: true, right: false });
  });

  it('shows neither when everything fits or the list is unmeasured', () => {
    expect(getHiddenSides(frame(0, 432))).toEqual({ left: false, right: false });
    expect(getHiddenSides(frame(0, 0))).toEqual({ left: false, right: false });
  });
});

describe('getPageOffset', () => {
  it('scrolls a visible width less the inset toward the side', () => {
    expect(getPageOffset(frame(0), 'right', 56)).toBe(144);
    expect(getPageOffset(frame(200), 'left', 56)).toBe(56);
  });

  it('stays inside the content', () => {
    expect(getPageOffset(frame(144), 'right', 56)).toBe(232);
    expect(getPageOffset(frame(100), 'left', 56)).toBe(0);
  });
});
