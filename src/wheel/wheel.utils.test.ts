import {
  alignToLap,
  firstEnabled,
  firstItemValue,
  getItemLabel,
  getLoopLayout,
  getRowFrames,
  getSettleResult,
  isNumericWheel,
  nearestEnabled,
  normalizeItem,
  offsetToIndex,
  resolveSeparator,
  toOddCount,
  wrapIndex,
} from './wheel.utils';

const H = 40;
const enabled = (n: number) => Array.from({ length: n }, () => ({}));

describe('normalizeItem', () => {
  it('wraps primitives', () => {
    expect(normalizeItem(5)).toEqual({ label: '5', value: 5 });
    expect(normalizeItem('a')).toEqual({ label: 'a', value: 'a' });
  });
  it('keeps item objects as is', () => {
    const item = { label: 'One', value: 1, disabled: true };
    expect(normalizeItem(item)).toBe(item);
  });
});

describe('firstItemValue', () => {
  it('reads the first primitive or object value', () => {
    expect(firstItemValue([3, 4])).toBe(3);
    expect(firstItemValue([{ label: 'A', value: 'a' }])).toBe('a');
    expect(firstItemValue([])).toBeUndefined();
  });
});

describe('toOddCount / wrapIndex / offsetToIndex', () => {
  it('rounds even counts up to odd', () => {
    expect(toOddCount(4)).toBe(5);
    expect(toOddCount(5)).toBe(5);
  });
  it('wraps negative and overflowing indexes', () => {
    expect(wrapIndex(-1, 5)).toBe(4);
    expect(wrapIndex(12, 5)).toBe(2);
  });
  it('rounds offsets to the nearest row within bounds', () => {
    expect(offsetToIndex(59, H, 10)).toBe(1);
    expect(offsetToIndex(61, H, 10)).toBe(2);
    expect(offsetToIndex(-30, H, 10)).toBe(0);
    expect(offsetToIndex(9999, H, 10)).toBe(9);
  });
});

describe('nearestEnabled / firstEnabled', () => {
  const items = [{ disabled: true }, {}, { disabled: true }, { disabled: true }, {}];
  it('prefers the next item, then the previous', () => {
    expect(nearestEnabled(items, 2)).toBe(1);
    expect(nearestEnabled(items, 3)).toBe(4);
    expect(nearestEnabled(items, 0)).toBe(1);
  });
  it('returns the start when nothing is enabled', () => {
    expect(nearestEnabled([{ disabled: true }, { disabled: true }], 0)).toBe(0);
  });
  it('only moves off disabled items', () => {
    expect(firstEnabled(items, 1)).toBe(1);
    expect(firstEnabled(items, 0)).toBe(1);
  });
});

describe('getLoopLayout', () => {
  it('uses one copy when not looping', () => {
    expect(getLoopLayout(12, false)).toEqual({ copies: 1, middle: 0, total: 12 });
  });
  it('repeats short lists enough to scroll freely', () => {
    expect(getLoopLayout(12, true)).toEqual({ copies: 41, middle: 240, total: 492 });
  });
  it('uses at least 7 copies for long lists', () => {
    expect(getLoopLayout(100, true)).toEqual({ copies: 7, middle: 300, total: 700 });
  });
  it('handles empty lists', () => {
    expect(getLoopLayout(0, true)).toEqual({ copies: 1, middle: 0, total: 0 });
  });
});

describe('alignToLap', () => {
  it('keeps the current lap when looping', () => {
    expect(alignToLap(243, 7, 12, true)).toBe(247);
  });
  it('is the logical index without looping', () => {
    expect(alignToLap(3, 7, 12, false)).toBe(7);
  });
});

describe('isNumericWheel', () => {
  it('is true only for all-digit labels', () => {
    expect(isNumericWheel([{ label: '00' }, { label: '15' }])).toBe(true);
    expect(isNumericWheel([{ label: '1' }, { label: 'AM' }])).toBe(false);
    expect(isNumericWheel([])).toBe(false);
  });
});

describe('getSettleResult', () => {
  const flat = (items: ReadonlyArray<{ disabled?: boolean }>, y: number, committed = 0) =>
    getSettleResult({ y, itemHeight: H, items, committed, loop: false, layout: getLoopLayout(items.length, false) });

  it('snaps when the offset is between rows', () => {
    expect(flat(enabled(5), 50)).toEqual({ kind: 'snap', dataIndex: 1 });
  });
  it('snaps off a disabled row to the nearest enabled one', () => {
    expect(flat([{}, { disabled: true }, {}], H)).toEqual({ kind: 'snap', dataIndex: 2 });
  });
  it('rests and reports a change', () => {
    expect(flat(enabled(5), 2 * H, 0)).toEqual({ kind: 'rest', logicalIndex: 2, changed: true, recenterTo: null });
  });
  it('rests without a change on the committed row', () => {
    expect(flat(enabled(5), 2 * H + 0.5, 2)).toEqual({ kind: 'rest', logicalIndex: 2, changed: false, recenterTo: null });
  });
  it('recentres a loop that drifted into an edge copy', () => {
    const layout = getLoopLayout(12, true);
    const result = getSettleResult({ y: 3 * H, itemHeight: H, items: enabled(12), committed: 3, loop: true, layout });
    expect(result).toEqual({ kind: 'rest', logicalIndex: 3, changed: false, recenterTo: layout.middle + 3 });
  });
  it('does not recentre inside the middle copies', () => {
    const layout = getLoopLayout(12, true);
    const result = getSettleResult({ y: (layout.middle + 5) * H, itemHeight: H, items: enabled(12), committed: 5, loop: true, layout });
    expect(result).toEqual({ kind: 'rest', logicalIndex: 5, changed: false, recenterTo: null });
  });
});

describe('getRowFrames', () => {
  const base = { dataIndex: 3, itemHeight: H, visibleItems: 5, rotation: 20, fadeTo: 0.3 };

  it('samples one row apart around the row centre', () => {
    const { inputRange } = getRowFrames({ ...base, variant: 'flat' });
    expect(inputRange).toEqual([0, 40, 80, 120, 160, 200, 240]);
  });
  it('is fully opaque in the centre and fades to fadeTo at the edges', () => {
    const { opacity } = getRowFrames({ ...base, variant: 'flat' });
    expect(opacity[3]).toBe(1);
    expect(opacity[0]).toBeCloseTo(0.3);
    expect(opacity[6]).toBeCloseTo(0.3);
  });
  it('flat rows shrink off-centre', () => {
    const { scale, translateY } = getRowFrames({ ...base, variant: 'flat' });
    expect(scale).toEqual([0.94, 0.94, 0.94, 1, 0.94, 0.94, 0.94]);
    expect(translateY).toBeUndefined();
  });
  it('3d rows sit flat in the centre and tilt symmetrically', () => {
    const { translateY, rotateX, scale } = getRowFrames({ ...base, variant: '3d' });
    expect(translateY?.[3]).toBeCloseTo(0);
    expect(rotateX?.[3]).toMatch(/^-?0deg$/);
    expect(scale[3]).toBeCloseTo(1);
    expect(translateY?.[2]).toBeCloseTo(-(translateY?.[4] ?? 0));
    expect(rotateX?.[2]).toBe('-20deg');
    expect(rotateX?.[4]).toBe('20deg');
  });
});

describe('resolveSeparator', () => {
  it('renders nothing before the first column or without a separator', () => {
    expect(resolveSeparator(':', 0)).toBeNull();
    expect(resolveSeparator(undefined, 1)).toBeNull();
  });
  it('passes the left column index to a separator function', () => {
    expect(resolveSeparator((left) => `after ${left}`, 2)).toBe('after 1');
  });
  it('treats false and undefined results as no separator', () => {
    expect(resolveSeparator(() => false, 1)).toBeNull();
    expect(resolveSeparator(() => undefined, 1)).toBeNull();
    expect(resolveSeparator('/', 1)).toBe('/');
  });
});

describe('getItemLabel', () => {
  it('finds the label of the selected item', () => {
    expect(getItemLabel([1, 2, 3], 2)).toBe('2');
    expect(getItemLabel([{ label: 'Small', value: 's' }], 's')).toBe('Small');
  });

  it('compares with isEqual', () => {
    const items = [{ label: 'Kyiv', value: { id: 1 } }];
    expect(getItemLabel(items, { id: 1 }, (a, b) => a.id === b.id)).toBe('Kyiv');
  });

  it('is empty when nothing matches', () => {
    expect(getItemLabel([1, 2], undefined)).toBe('');
    expect(getItemLabel([{ label: 'Kyiv', value: { id: 1 } }], undefined, (a, b) => a.id === b.id)).toBe('');
    expect(getItemLabel([1, 2], 9)).toBe('');
  });
});
