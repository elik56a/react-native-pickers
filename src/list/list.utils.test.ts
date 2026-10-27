import { findItemIndex, getRevealOffset } from './list.utils';

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
