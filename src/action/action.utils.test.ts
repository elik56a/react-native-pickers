import { getMenuAnchor } from './action.utils';

const trigger = (x: number) => ({
  x,
  y: 100,
  width: 40,
  height: 40,
});

describe('getMenuAnchor', () => {
  it('lines the menu up with the left edge, or the right edge for a trigger on the right', () => {
    expect(getMenuAnchor(trigger(16), 200, 'auto', 400, false)).toMatchObject({ x: 16, width: 200 });
    expect(getMenuAnchor(trigger(340), 200, 'auto', 400, false)).toMatchObject({ x: 180, width: 200 });
  });

  it('follows start and end, flipped in right-to-left layouts', () => {
    expect(getMenuAnchor(trigger(16), 200, 'end', 400, false).x).toBe(-144);
    expect(getMenuAnchor(trigger(340), 200, 'start', 400, false).x).toBe(340);
    expect(getMenuAnchor(trigger(340), 200, 'start', 400, true).x).toBe(180);
  });
});
