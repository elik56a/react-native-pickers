import { getDropdownFrame, isSwipeDown, resolvePresentation, resolveSheetHeight, shouldDismiss } from './sheet.utils';

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

describe('resolvePresentation', () => {
  it('picks a modal for auto only on web windows wider than the sheet', () => {
    expect(resolvePresentation('auto', 'web', 1440)).toBe('modal');
    expect(resolvePresentation('auto', 'web', 688)).toBe('modal');
    expect(resolvePresentation('auto', 'web', 687)).toBe('bottomSheet');
    expect(resolvePresentation('auto', 'ios', 1024)).toBe('bottomSheet');
  });

  it('keeps an explicit choice on every platform', () => {
    expect(resolvePresentation('modal', 'ios', 390)).toBe('modal');
    expect(resolvePresentation('bottomSheet', 'web', 1440)).toBe('bottomSheet');
  });
});

describe('getDropdownFrame', () => {
  const field = (y: number) => ({
    x: 16,
    y,
    width: 300,
    height: 48,
  });

  it('opens below the field with its width', () => {
    expect(getDropdownFrame(field(100), 800, 320)).toEqual({ left: 16, width: 300, top: 152, maxHeight: 320 });
  });

  it('flips above when there is more room there', () => {
    expect(getDropdownFrame(field(600), 800, 320)).toEqual({ left: 16, width: 300, bottom: 204, maxHeight: 320 });
  });

  it('stays below and shrinks when below still has more room', () => {
    expect(getDropdownFrame(field(300), 800, 500)).toEqual({ left: 16, width: 300, top: 352, maxHeight: 440 });
  });
});
