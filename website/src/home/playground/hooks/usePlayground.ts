import { useCallback, useState } from 'react';

import { ACCENTS, DEFAULT_OPTIONS } from '../playground.constants';
import type { ControlValue, DemoTab, Playground } from '../playground.types';

/** The props panel's state: the picker it edits (the booking field last touched, none until one is), each picker's props, and the theme. */
export const usePlayground = (): Playground => {
  const [tab, setTab] = useState<DemoTab | null>(null);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [accent, setAccent] = useState(ACCENTS[0]);

  const setOption = useCallback((target: DemoTab, key: string, value: ControlValue) => {
    setTab(target);
    setOptions((prev) => ({
      ...prev,
      [target]: {
        ...prev[target],
        [key]: value,
      },
    }));
  }, []);

  return {
    tab,
    options,
    accent,
    selectTab: setTab,
    setOption,
    setAccent,
  };
};
