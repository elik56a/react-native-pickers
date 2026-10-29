import { clamp, clamp01, roundTo, stepDecimals, toFraction } from './track.utils';

describe('track utils', () => {
  it('clamps into a range', () => {
    expect(clamp(5, 0, 3)).toBe(3);
    expect(clamp(-1, 0, 3)).toBe(0);
    expect(clamp01(0.4)).toBe(0.4);
    expect(clamp01(2)).toBe(1);
  });

  it('turns a touch along a length into a fraction, 0 before the length is known', () => {
    expect(toFraction(50, 200)).toBe(0.25);
    expect(toFraction(-10, 200)).toBe(0);
    expect(toFraction(300, 200)).toBe(1);
    expect(toFraction(50, 0)).toBe(0);
  });

  it('rounds away float noise, to as many decimals as a step has', () => {
    expect(roundTo(0.1 + 0.2, 1)).toBe(0.3);
    expect(stepDecimals(0.25)).toBe(2);
    expect(stepDecimals(5)).toBe(0);
  });
});
