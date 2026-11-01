import { useCallback, useState } from 'react';

import { ACCENTS, DEFAULT_OPTIONS, FIELD_TABS } from '../playground.constants';
import type { ControlValue, DemoTab, Playground } from '../playground.types';

/** The playground's state: the picker the phone shows (the booking's first step, Where, at first), each picker's props, and the theme. */
export const usePlayground = (): Playground => {
  const [tab, setTab] = useState<DemoTab>(FIELD_TABS[0].tab);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [accent, setAccent] = useState(ACCENTS[0]);

  const setOption = useCallback((target: DemoTab, key: string, value: ControlValue) => {
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
