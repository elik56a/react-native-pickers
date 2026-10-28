import { getSwipeDelta, isHorizontalSwipe } from './swipe.utils';

describe('swipe', () => {
  it('claims clearly horizontal moves only', () => {
    expect(isHorizontalSwipe(20, 5)).toBe(true);
    expect(isHorizontalSwipe(20, 15)).toBe(false);
    expect(isHorizontalSwipe(10, 0)).toBe(false);
  });
  it('turns a long or fast swipe into a page step, mirrored in RTL', () => {
    expect(getSwipeDelta(-60, 0, false)).toBe(1);
    expect(getSwipeDelta(60, 0, false)).toBe(-1);
    expect(getSwipeDelta(-20, -0.8, false)).toBe(1);
    expect(getSwipeDelta(-60, 0, true)).toBe(-1);
    expect(getSwipeDelta(-20, -0.1, false)).toBe(0);
  });
});
