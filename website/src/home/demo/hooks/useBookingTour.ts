import type { RefObject } from 'react';
import { useEffect } from 'react';

import { TOUR_LOOP_MS, TOUR_MOVE_MS, TOUR_PRESS_MS, TOUR_START_MS, TOUR_STEPS, TOUR_TRIPS } from '../demo.constants';
import styles from '../tour.module.css';
import { centerOf, findTourTarget } from '../tour.utils';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/**
 * Books trip after trip in the hero's app by tapping its real fields, sheets and buttons, until the visitor touches it. A synthetic
 * click is what react-native-web turns into `onPress`; focusing the field first tells the device mock which phone the sheet opens in.
 * The fingertip lives on <body>, above the sheets the mock pins over the phone.
 */
export const useBookingTour = (rootRef: RefObject<HTMLElement | null>, enabled: boolean, onStop: () => void) => {
  useEffect(() => {
    const root = rootRef.current;
    if (!enabled || !root || window.matchMedia(REDUCED_MOTION).matches) return;
    let stopped = false;
    const timers: number[] = [];
    const wait = (ms: number) => new Promise((resolve) => timers.push(window.setTimeout(resolve, ms)));
    const fingertip = document.createElement('span');
    fingertip.className = styles.fingertip;
    fingertip.setAttribute('aria-hidden', 'true');

    const stop = (e: Event) => {
      const target = e.target as Element;
      if (!e.isTrusted || !(root.contains(target) || !target.closest('#__docusaurus'))) return;
      stopped = true;
      fingertip.remove();
      onStop();
    };
    document.addEventListener('pointerdown', stop, true);
    document.addEventListener('keydown', stop, true);

    const tap = async (el: HTMLElement) => {
      const { x, y } = centerOf(el);
      fingertip.style.transform = `translate(${x}px, ${y}px)`;
      if (!fingertip.isConnected) document.body.append(fingertip);
      await wait(TOUR_MOVE_MS);
      if (stopped) return;
      fingertip.classList.add(styles.pressed);
      el.focus({ preventScroll: true });
      el.click();
      el.blur();
      await wait(TOUR_PRESS_MS);
      fingertip.classList.remove(styles.pressed);
    };

    const run = async () => {
      await wait(TOUR_START_MS);
      for (let round = 0; !stopped; round++) {
        const trip = TOUR_TRIPS[round % TOUR_TRIPS.length];
        for (const step of TOUR_STEPS) {
          await wait(step.pause);
          const el = !stopped && findTourTarget(step.target, root, trip);
          if (el) await tap(el);
        }
        fingertip.remove();
        await wait(TOUR_LOOP_MS);
      }
    };
    run();

    return () => {
      stopped = true;
      timers.forEach(clearTimeout);
      fingertip.remove();
      document.removeEventListener('pointerdown', stop, true);
      document.removeEventListener('keydown', stop, true);
    };
  }, [rootRef, enabled, onStop]);
};
