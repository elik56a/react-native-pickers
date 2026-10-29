import type { ScrollNode } from './sheet.types';
import {
  canScrollWithin,
  getDragFrame,
  getDropdownFrame,
  getFloatingLabelShift,
  getReleaseTarget,
  getSheetDefaults,
  getWheelTarget,
  isVerticalDrag,
  resolveFieldPresentation,
  resolvePresentation,
  resolveSheetHeight,
  shouldCollapseOnPress,
  shouldDismiss,
  splitFieldProps,
  toLocalRect,
} from './sheet.utils';

describe('resolveSheetHeight', () => {
  it('treats values up to 1 as a window fraction', () => {
    expect(resolveSheetHeight(0.5, 800)).toBe(400);
    expect(resolveSheetHeight(1, 800)).toBe(800);
    expect(resolveSheetHeight(300, 800)).toBe(300);
    expect(resolveSheetHeight(undefined, 800)).toBeUndefined();
  });
});

describe('isVerticalDrag', () => {
  it('needs a mostly vertical drag past the start distance, either way', () => {
    expect(isVerticalDrag(0, 10)).toBe(true);
    expect(isVerticalDrag(0, -10)).toBe(true);
    expect(isVerticalDrag(0, 5)).toBe(false);
    expect(isVerticalDrag(20, 10)).toBe(false);
  });
});

describe('getDragFrame', () => {
  it('grows up to the max height when dragged up', () => {
    expect(getDragFrame(400, -100, 400, 760, true)).toEqual({ height: 500, offset: 0 });
    expect(getDragFrame(400, -900, 400, 760, true)).toEqual({ height: 760, offset: 0 });
  });

  it('pulls below the base height towards closing, only when closing is allowed', () => {
    expect(getDragFrame(400, 120, 400, 760, true)).toEqual({ height: 400, offset: 120 });
    expect(getDragFrame(400, 120, 400, 760, false)).toEqual({ height: 400, offset: 0 });
  });

  it('collapses an expanded sheet first, then pulls it down', () => {
    expect(getDragFrame(760, 200, 400, 760, true)).toEqual({ height: 560, offset: 0 });
    expect(getDragFrame(760, 400, 400, 760, true)).toEqual({ height: 400, offset: 40 });
  });
});

describe('getReleaseTarget', () => {
  it('snaps to the nearer height when released slowly', () => {
    expect(getReleaseTarget({ height: 600, offset: 0 }, 0, 400, 760, true)).toBe('expanded');
    expect(getReleaseTarget({ height: 550, offset: 0 }, 0, 400, 760, true)).toBe('base');
  });

  it('follows a flick', () => {
    expect(getReleaseTarget({ height: 420, offset: 0 }, -1, 400, 760, true)).toBe('expanded');
    expect(getReleaseTarget({ height: 740, offset: 0 }, 1, 400, 760, true)).toBe('base');
  });

  it('closes past the dismiss distance below the base height', () => {
    expect(getReleaseTarget({ height: 400, offset: 150 }, 0, 400, 760, true)).toBe('close');
    expect(getReleaseTarget({ height: 400, offset: 30 }, 0, 400, 760, true)).toBe('base');
    expect(getReleaseTarget({ height: 400, offset: 150 }, 0, 400, 760, false)).toBe('base');
  });

  it('stays at the base height when it cannot expand', () => {
    expect(getReleaseTarget({ height: 400, offset: 0 }, -2, 400, 400, true)).toBe('base');
  });
});

describe('getWheelTarget', () => {
  it('expands on wheel up', () => {
    expect(getWheelTarget(-50, false, true, true)).toBe('expanded');
    expect(getWheelTarget(-50, true, true, true)).toBeNull();
    expect(getWheelTarget(-50, false, false, true)).toBeNull();
  });

  it('collapses, then closes, on wheel down', () => {
    expect(getWheelTarget(50, true, true, true)).toBe('base');
    expect(getWheelTarget(50, false, true, true)).toBe('close');
    expect(getWheelTarget(50, false, true, false)).toBeNull();
  });
});

describe('canScrollWithin', () => {
  const node = (scrollTop: number, parentElement: ScrollNode | null = null): ScrollNode => ({
    parentElement,
    scrollTop,
    scrollHeight: 1000,
    clientHeight: 300,
  });
  const root = node(0);
  const overflow = (scrollable: ScrollNode) => (n: ScrollNode) => (n === scrollable ? 'auto' : 'visible');

  it('lets a list that can still scroll keep the wheel', () => {
    const list = node(200, root);
    const row = node(0, list);
    expect(canScrollWithin(row, root, -10, overflow(list))).toBe(true);
    expect(canScrollWithin(row, root, 10, overflow(list))).toBe(true);
  });

  it('hands the wheel to the sheet at the scroll ends', () => {
    const top = node(0, root);
    const bottom = node(700, root);
    expect(canScrollWithin(top, root, -10, overflow(top))).toBe(false);
    expect(canScrollWithin(bottom, root, 10, overflow(bottom))).toBe(false);
  });

  it('ignores elements that clip rather than scroll', () => {
    const clipped = node(200, root);
    expect(canScrollWithin(clipped, root, -10, () => 'hidden')).toBe(false);
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
    expect(getDropdownFrame(field(100), { width: 400, height: 800 }, 320)).toEqual({ left: 16, width: 300, top: 152, maxHeight: 320 });
  });

  it('flips above when there is more room there', () => {
    expect(getDropdownFrame(field(600), { width: 400, height: 800 }, 320)).toEqual({ left: 16, width: 300, bottom: 204, maxHeight: 320 });
  });

  it('stays below and shrinks when below still has more room', () => {
    expect(getDropdownFrame(field(300), { width: 400, height: 800 }, 500)).toEqual({ left: 16, width: 300, top: 352, maxHeight: 440 });
  });

  it('grows to minWidth and shifts left to stay inside the window', () => {
    expect(getDropdownFrame({ ...field(100), x: 40, width: 280 }, { width: 360, height: 800 }, 320, 320)).toMatchObject({
      left: 32,
      width: 320,
    });
  });

  it('never grows wider than the window allows', () => {
    expect(getDropdownFrame({ ...field(100), x: 0, width: 200 }, { width: 300, height: 800 }, 320, 320)).toMatchObject({
      left: 0,
      width: 284,
    });
  });
});

describe('splitFieldProps', () => {
  it('keeps the field props for the field and the rest for the sheet, and gives both the theme and design', () => {
    const onClose = jest.fn();
    const theme = { radius: { md: 4 } };
    const styles = { trigger: { padding: 1 } };
    const { field, sheet } = splitFieldProps({
      label: 'Due',
      onClose,
      testID: 'due',
      theme,
      design: 'material',
      styles,
      title: 'Pick',
      locale: 'he',
    });
    expect(field).toMatchObject({
      label: 'Due',
      onClose,
      testID: 'due',
      theme,
      design: 'material',
      styles,
    });
    expect(sheet).toEqual({
      theme,
      design: 'material',
      styles,
      title: 'Pick',
      locale: 'he',
    });
  });
});

describe('resolveFieldPresentation', () => {
  it('turns auto into a dropdown on the web only', () => {
    expect(resolveFieldPresentation('auto', 'web')).toBe('dropdown');
    expect(resolveFieldPresentation('auto', 'ios')).toBe('auto');
    expect(resolveFieldPresentation('modal', 'web')).toBe('modal');
    expect(resolveFieldPresentation('bottomSheet', 'web')).toBe('bottomSheet');
  });
});

describe('shouldCollapseOnPress', () => {
  it('collapses only an open inline field', () => {
    expect(shouldCollapseOnPress('inline', true)).toBe(true);
    expect(shouldCollapseOnPress('inline', false)).toBe(false);
    expect(shouldCollapseOnPress('dropdown', true)).toBe(false);
    expect(shouldCollapseOnPress('bottomSheet', true)).toBe(false);
  });
});

describe('getSheetDefaults', () => {
  it('leaves room for the iOS home indicator and status bar, and drags by the header on native only', () => {
    expect(getSheetDefaults('ios')).toEqual({
      bottomInset: 24,
      draggable: true,
      expandedTopInset: 54,
    });
    expect(getSheetDefaults('android')).toMatchObject({
      bottomInset: 12,
      draggable: true,
    });
    expect(getSheetDefaults('web')).toEqual({
      bottomInset: 12,
      draggable: false,
      expandedTopInset: 0,
    });
  });
});

describe('getFloatingLabelShift', () => {
  it('moves the label onto the top border, and left by what scaling around its centre takes off its start', () => {
    expect(getFloatingLabelShift(54, 80, 0.75, 2)).toEqual({ x: -10, y: -28 });
    expect(getFloatingLabelShift(54, 80, 1, 1)).toEqual({ x: -0, y: -27.5 });
  });
});

describe('toLocalRect', () => {
  it('moves a window rect into an area that starts elsewhere', () => {
    const area = { x: 100, y: 50, width: 390, height: 844 };
    expect(toLocalRect({ x: 116, y: 150, width: 40, height: 40 }, area)).toEqual({ x: 16, y: 100, width: 40, height: 40 });
  });
});
