import { Animated, I18nManager } from 'react-native';

import { act, renderHook } from '@testing-library/react-native';

import { useSlideIn } from './useSlideIn';

/** `timing` held at its start, so the value shows where the page slides in from. */
const holdTiming = () =>
  jest.spyOn(Animated, 'timing').mockReturnValue({
    start: jest.fn(),
    stop: jest.fn(),
    reset: jest.fn(),
  });

const offsetOf = ({ transform: [move] }: ReturnType<typeof useSlideIn>['style']) =>
  (move?.translateX as unknown as { __getValue: () => number } | undefined)?.__getValue();

describe('useSlideIn', () => {
  afterEach(() => jest.restoreAllMocks());

  it('starts the next page to the right, the previous one to the left, and slides it to the middle', async () => {
    const spy = holdTiming();
    const { result } = await renderHook(() => useSlideIn(200));
    expect(offsetOf(result.current.style)).toBe(0);
    await act(() => result.current.from(1));
    expect(offsetOf(result.current.style)).toBeGreaterThan(0);
    expect(spy).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ toValue: 0, duration: 200 }));
    await act(() => result.current.from(-1));
    expect(offsetOf(result.current.style)).toBeLessThan(0);
  });

  it('mirrors the sides in RTL', async () => {
    holdTiming();
    jest.replaceProperty(I18nManager, 'isRTL', true);
    const { result } = await renderHook(() => useSlideIn(200));
    await act(() => result.current.from(1));
    expect(offsetOf(result.current.style)).toBeLessThan(0);
  });
});
