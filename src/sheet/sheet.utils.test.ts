import { isSwipeDown, resolveSheetHeight, shouldDismiss } from './sheet.utils';

describe('resolveSheetHeight', () => {
  it('treats values up to 1 as a window fraction', () => {
    expect(resolveSheetHeight(0.5, 800)).toBe(400);
    expect(resolveSheetHeight(1, 800)).toBe(800);
    expect(resolveSheetHeight(300, 800)).toBe(300);
    expect(resolveSheetHeight(undefined, 800)).toBeUndefined();
  });
});

describe('isSwipeDown', () => {
  it('needs a mostly vertical downward drag past the start distance', () => {
    expect(isSwipeDown(0, 10)).toBe(true);
    expect(isSwipeDown(0, 5)).toBe(false);
    expect(isSwipeDown(20, 10)).toBe(false);
    expect(isSwipeDown(0, -10)).toBe(false);
  });
});

describe('shouldDismiss', () => {
  it('closes past the smaller of the fixed distance and 30% of the sheet', () => {
    expect(shouldDismiss(141, 0, 1000)).toBe(true);
    expect(shouldDismiss(139, 0, 1000)).toBe(false);
    expect(shouldDismiss(61, 0, 200)).toBe(true);
    expect(shouldDismiss(59, 0, 200)).toBe(false);
  });

  it('closes on a fast flick', () => {
    expect(shouldDismiss(10, 1, 1000)).toBe(true);
  });
});
