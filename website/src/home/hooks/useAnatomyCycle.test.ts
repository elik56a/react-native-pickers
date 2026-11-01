import { act, renderHook } from '@testing-library/react-native';

import { ANATOMY_CYCLE_MS, ANATOMY_SLIDE_MS } from '../home.constants';
import { useAnatomyCycle } from './useAnatomyCycle';

/** A stand-in for the section: records its listeners so the test can fire them. */
const createSection = () => {
  const listeners: Record<string, () => void> = {};
  return {
    listeners,
    current: {
      addEventListener: (type: string, listener: () => void) => {
        listeners[type] = listener;
      },
      removeEventListener: jest.fn(),
    } as unknown as HTMLElement,
  };
};

describe('useAnatomyCycle', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // The section is on screen as soon as it's observed.
    global.IntersectionObserver = jest.fn((callback: (entries: { isIntersecting: boolean }[]) => void) => ({
      observe: () => callback([{ isIntersecting: true }]),
      disconnect: jest.fn(),
    })) as unknown as typeof IntersectionObserver;
  });
  afterEach(() => jest.useRealTimers());

  it('loops forward: onto the copy of the first screen, then back to the real one without a slide', async () => {
    const section = createSection();
    const { result } = await renderHook(() => useAnatomyCycle(section, 2));
    await act(() => jest.advanceTimersByTime(ANATOMY_CYCLE_MS));
    await act(() => jest.advanceTimersByTime(ANATOMY_CYCLE_MS));
    expect(result.current.position).toBe(2);
    expect(result.current.index).toBe(0);
    await act(() => jest.advanceTimersByTime(ANATOMY_SLIDE_MS));
    expect(result.current.position).toBe(0);
    expect(result.current.instant).toBe(true);
  });

  it('moves on while on screen, and wraps around', async () => {
    const section = createSection();
    const { result } = await renderHook(() => useAnatomyCycle(section, 3));
    expect(result.current.running).toBe(true);
    const seen = [];
    for (let turn = 0; turn < 4; turn++) {
      await act(() => jest.advanceTimersByTime(ANATOMY_CYCLE_MS));
      seen.push(result.current.index);
    }
    expect(seen).toEqual([1, 2, 0, 1]);
  });

  it('holds under the pointer, and carries on from a picked screen once it leaves', async () => {
    const section = createSection();
    const { result } = await renderHook(() => useAnatomyCycle(section, 3));
    await act(() => section.listeners.pointerenter());
    expect(result.current.visible).toBe(true);
    await act(() => result.current.select(2));
    await act(() => jest.advanceTimersByTime(ANATOMY_CYCLE_MS * 2));
    expect(result.current.index).toBe(2);
    expect(result.current.running).toBe(false);
    await act(() => section.listeners.pointerleave());
    await act(() => jest.advanceTimersByTime(ANATOMY_CYCLE_MS));
    expect(result.current.index).toBe(0);
  });

  it('holds while either the pointer or focus is on the device', async () => {
    const section = createSection();
    const { result } = await renderHook(() => useAnatomyCycle(section, 3));
    await act(() => section.listeners.pointerenter());
    await act(() => section.listeners.focusin());
    await act(() => section.listeners.pointerleave());
    await act(() => jest.advanceTimersByTime(ANATOMY_CYCLE_MS));
    expect(result.current.running).toBe(false);
    expect(result.current.index).toBe(0);
    await act(() => section.listeners.focusout());
    await act(() => jest.advanceTimersByTime(ANATOMY_CYCLE_MS));
    expect(result.current.index).toBe(1);
  });
});
