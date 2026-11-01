import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

import { HERO_SCROLL_STEP_MS } from '../hero.constants';
import { scrollPixels, scrollStep } from '../hero.utils';

/**
 * Turns the wheel a row for every row the mouse drags, and one row a mouse-wheel notch. Touch scrolls the wheel's list natively, but
 * a browser doesn't scroll a list when a mouse drags it, and a notch scrolls the tall rows less than half a row, so the list snaps back.
 */
export const useWheelDrag = (ref: RefObject<HTMLElement | null>, rowHeight: number, onStep: (step: number) => void) => {
  const stepRef = useRef(onStep);
  stepRef.current = onStep;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let startY = 0;
    let applied = 0;
    let dragged = false;
    let scrolled = 0;
    let lastStep = Number.NEGATIVE_INFINITY;

    const onMove = (event: PointerEvent) => {
      const rows = Math.trunc((startY - event.clientY) / rowHeight);
      if (rows === applied) return;
      stepRef.current(rows - applied);
      applied = rows;
      dragged = true;
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      startY = event.clientY;
      applied = 0;
      dragged = false;
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    };
    // The words are selectable text: a selection drag would also scroll the list under the pointer, on top of these steps.
    const onSelectStart = (event: Event) => event.preventDefault();
    // A drag that ends over a word shouldn't also pick that word.
    const onClick = (event: MouseEvent) => {
      if (!dragged) return;
      event.stopPropagation();
      dragged = false;
    };

    // Before the list scrolls natively; a trackpad's run of small scrolls adds up, and its momentum waits for each turn to land.
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (event.timeStamp - lastStep < HERO_SCROLL_STEP_MS) return;
      scrolled += scrollPixels(event);
      const step = scrollStep(scrolled);
      if (!step) return;
      stepRef.current(step);
      scrolled = 0;
      lastStep = event.timeStamp;
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('wheel', onWheel, { capture: true, passive: false });
    el.addEventListener('selectstart', onSelectStart);
    el.addEventListener('click', onClick, true);
    return () => {
      onUp();
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('selectstart', onSelectStart);
      el.removeEventListener('click', onClick, true);
      el.removeEventListener('wheel', onWheel, true);
    };
  }, [ref, rowHeight]);
};
