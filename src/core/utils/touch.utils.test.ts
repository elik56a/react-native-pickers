import { getRippleOrigin } from './touch.utils';

describe('getRippleOrigin', () => {
  it('reaches the farthest corner from the touch point', () => {
    expect(getRippleOrigin(0, 0, 30, 40)).toEqual({ x: 0, y: 0, radius: 50 });
    expect(getRippleOrigin(30, 40, 30, 40).radius).toBe(50);
  });

  it('is half the diagonal from the centre', () => {
    expect(getRippleOrigin(15, 20, 30, 40).radius).toBe(25);
  });
});
