import { useCallback, useState } from 'react';

import type { HeroSetter, HeroValues } from '../hero.types';
import { getInitialHeroValues } from '../hero.utils';

/** What the visitor picked on the hero's screens, and a setter per value. */
export const useHeroValues = () => {
  const [values, setValues] = useState<HeroValues>(() => getInitialHeroValues(new Date()));
  // Stable, so a new value doesn't re-render every screen.
  const set = useCallback<HeroSetter>(
    (key) => (value) =>
      setValues((current) => ({
        ...current,
        [key]: value,
      })),
    []
  );
  return {
    values,
    set,
  };
};
