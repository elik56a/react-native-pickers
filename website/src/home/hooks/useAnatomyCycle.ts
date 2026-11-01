import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

import { ANATOMY_CYCLE_MS, ANATOMY_SLIDE_MS, REDUCED_MOTION_QUERY } from '../home.constants';

/**
 * The annotated device's carousel, looping forward for good: `position` is the slide on the track, which holds the `count` screens and
 * a copy of the first after the last, and `index` the screen it shows. After the last screen it slides on to the copy, then jumps back
 * to the real first one without a transition (`instant`), so the loop never rewinds. It moves while the section is on screen and holds
 * while the pointer or focus is on the device (`ref`), so it never moves under someone using it. Never on its own under reduced motion.
 * `visible` also holds the callouts' drawing until the section is on screen.
 */
export const useAnatomyCycle = (ref: RefObject<HTMLElement | null>, count: number) => {
  const [position, setPosition] = useState(0);
  const [instant, setInstant] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const index = position % count;
  const running = visible && !hovered && !focused;

  // A full turn for every screen, however it got there: the timer restarts with the screen, as the tab's progress bar does. From
  // `index`, not `position`: the jump back from the copy to the first screen is the same screen, so it keeps its timer.
  useEffect(() => {
    if (!running || window.matchMedia?.(REDUCED_MOTION_QUERY).matches) return;
    const timer = setTimeout(() => {
      setInstant(false);
      setPosition(index + 1);
    }, ANATOMY_CYCLE_MS);
    return () => clearTimeout(timer);
  }, [running, index]);

  useEffect(() => {
    if (position !== count) return;
    const timer = setTimeout(() => {
      setInstant(true);
      setPosition(0);
    }, ANATOMY_SLIDE_MS);
    return () => clearTimeout(timer);
  }, [position, count]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.4 });
    observer.observe(el);
    const enter = () => setHovered(true);
    const leave = () => setHovered(false);
    const focus = () => setFocused(true);
    const blur = () => setFocused(false);
    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointerleave', leave);
    el.addEventListener('focusin', focus);
    el.addEventListener('focusout', blur);
    return () => {
      observer.disconnect();
      el.removeEventListener('pointerenter', enter);
      el.removeEventListener('pointerleave', leave);
      el.removeEventListener('focusin', focus);
      el.removeEventListener('focusout', blur);
    };
  }, [ref]);

  return {
    index,
    position,
    instant,
    visible,
    running,
    select: (next: number) => {
      setInstant(false);
      setPosition(next);
    },
  };
};
