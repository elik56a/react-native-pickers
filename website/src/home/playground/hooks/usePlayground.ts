import { useCallback, useEffect, useState } from 'react';

import { ACCENTS, AUTOPLAY_MS, DEFAULT_OPTIONS, DEMO_TABS } from '../playground.constants';
import type { Accent, ControlValue, DemoTab, Playground } from '../playground.types';

export const usePlayground = ({ autoplay: autoplayInitially = true } = {}): Playground => {
  const [tab, setTab] = useState<DemoTab>(DEMO_TABS[0]);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [accent, setAccentState] = useState(ACCENTS[0]);
  const [autoplay, setAutoplay] = useState(autoplayInitially);

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => setTab((t) => DEMO_TABS[(DEMO_TABS.indexOf(t) + 1) % DEMO_TABS.length]), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [autoplay]);

  const stopAutoplay = useCallback(() => setAutoplay(false), []);

  const selectTab = useCallback((next: DemoTab) => {
    setAutoplay(false);
    setTab(next);
  }, []);

  const setOption = useCallback((target: DemoTab, key: string, value: ControlValue) => {
    setAutoplay(false);
    setTab(target);
    setOptions((prev) => ({
      ...prev,
      [target]: {
        ...prev[target],
        [key]: value,
      },
    }));
  }, []);

  const setAccent = useCallback((next: Accent) => {
    setAutoplay(false);
    setAccentState(next);
  }, []);

  return {
    tab,
    options,
    accent,
    selectTab,
    setOption,
    setAccent,
    stopAutoplay,
  };
};
