import { act, renderHook } from '@testing-library/react-native';

import { HERO_SPIN_MS, HERO_SWAP_DELAY_MS, HERO_WORD, HERO_WORDS } from '../hero.constants';
import { useHero } from './useHero';

/** A stand-in for the hero: records its listeners so the test can fire them. */
const createElement = () => {
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

describe('useHero', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    window.matchMedia = jest.fn(() => ({ matches: false })) as unknown as typeof window.matchMedia;
  });
  afterEach(() => jest.useRealTimers());

  it('spins through every word once, the devices following once each turn lands, the last one too', async () => {
    const { result } = await renderHook(() => useHero(createElement(), createElement()));
    await act(() => jest.advanceTimersByTime(HERO_SPIN_MS));
    for (let turn = 1; turn <= HERO_WORDS.length; turn++) {
      const word = HERO_WORDS[turn % HERO_WORDS.length].word;
      expect(result.current.word).toBe(word);
      expect(result.current.spec.word).toBe(HERO_WORDS[turn - 1].word);
      await act(() => jest.advanceTimersByTime(HERO_SWAP_DELAY_MS));
      expect(result.current.spec.word).toBe(word);
      await act(() => jest.advanceTimersByTime(HERO_SPIN_MS - HERO_SWAP_DELAY_MS));
    }
    await act(() => jest.advanceTimersByTime(HERO_SPIN_MS * 2));
    expect(result.current.word).toBe(HERO_WORDS[0].word);
  });

  it('stops once the visitor touches the hero', async () => {
    const hero = createElement();
    const { result } = await renderHook(() => useHero(hero, createElement()));
    await act(() => hero.listeners.pointerdown());
    await act(() => jest.advanceTimersByTime(HERO_SPIN_MS * 2));
    expect(result.current.word).toBe(HERO_WORDS[0].word);
  });

  it('shows the visitor’s own pick at once', async () => {
    const { result } = await renderHook(() => useHero(createElement(), createElement()));
    await act(() => result.current.pick(HERO_WORD.color));
    expect(result.current.spec.word).toBe(HERO_WORD.color);
    await act(() => result.current.step(1));
    expect(result.current.spec.word).toBe(HERO_WORDS[HERO_WORDS.findIndex((s) => s.word === HERO_WORD.color) + 1].word);
  });
});
