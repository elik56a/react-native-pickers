import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

import { REDUCED_MOTION_QUERY } from '../../home.constants';
import { HERO_SPIN_MS, HERO_SWAP_DELAY_MS, HERO_WORDS } from '../hero.constants';
import type { HeroWord } from '../hero.types';
import { getWordSpec, nextWord, stepWord } from '../hero.utils';
import { useDelayedValue } from './useDelayedValue';
import { useHeroValues } from './useHeroValues';

/**
 * The headline's word and the values the three devices share. Until the visitor touches the hero, the wheel turns on its own through
 * every word once and comes back to the first, so each device shows each pattern. A press or key anywhere in `ref`, or the pointer
 * reaching the word's band, stops it, so the wheel never turns under someone about to use it.
 */
export const useHero = (ref: RefObject<HTMLElement | null>, bandRef: RefObject<HTMLElement | null>) => {
  const [word, setWord] = useState<HeroWord>(HERO_WORDS[0].word);
  const [touched, setTouched] = useState(false);
  const { values, set } = useHeroValues();

  useEffect(() => {
    if (touched || window.matchMedia(REDUCED_MOTION_QUERY).matches) return;
    let turns = 0;
    const timer = setInterval(() => {
      turns += 1;
      setWord(nextWord);
      if (turns === HERO_WORDS.length) clearInterval(timer);
    }, HERO_SPIN_MS);
    return () => clearInterval(timer);
  }, [touched]);

  // The visitor's own pick has already landed, so it shows at once.
  const shown = useDelayedValue(word, touched ? 0 : HERO_SWAP_DELAY_MS);

  useEffect(() => {
    const el = ref.current;
    const band = bandRef.current;
    if (!el || touched) return;
    const touch = () => setTouched(true);
    el.addEventListener('pointerdown', touch);
    el.addEventListener('keydown', touch);
    band?.addEventListener('pointerenter', touch);
    return () => {
      el.removeEventListener('pointerdown', touch);
      el.removeEventListener('keydown', touch);
      band?.removeEventListener('pointerenter', touch);
    };
  }, [ref, bandRef, touched]);

  return {
    word,
    spec: getWordSpec(shown),
    pick: (next: HeroWord) => {
      setTouched(true);
      setWord(next);
    },
    step: (step: number) => {
      setTouched(true);
      setWord((current) => stepWord(current, step));
    },
    values,
    set,
  };
};
