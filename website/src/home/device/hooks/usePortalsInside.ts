import type { RefObject } from 'react';
import { useEffect } from 'react';

import { pinOver } from '../device.utils';

/** The page shows two devices; a sheet belongs to the one the visitor last touched. */
let activeFrame: HTMLElement | null = null;

/**
 * react-native-web portals every Modal into a bare <div> appended to <body>. Pinning those over the phone (the transform makes the
 * modal's `position: fixed` relative to it) opens sheets inside the device instead of over the whole page.
 */
// ponytail: the pin is measured once on open, so resizing the window while a sheet is open leaves it misplaced until it reopens
export const usePortalsInside = (frameRef: RefObject<HTMLDivElement | null>, enabled: boolean) => {
  useEffect(() => {
    const frame = frameRef.current;
    if (!enabled || !frame) return;
    const claim = () => {
      activeFrame = frame;
    };
    frame.addEventListener('pointerdown', claim, true);
    frame.addEventListener('focusin', claim);
    const observer = new MutationObserver((mutations) => {
      if (activeFrame !== frame) return;
      for (const node of mutations.flatMap((m) => Array.from(m.addedNodes))) {
        if (node instanceof HTMLDivElement && !node.attributes.length) pinOver(node, frame);
      }
    });
    observer.observe(document.body, { childList: true });
    return () => {
      observer.disconnect();
      frame.removeEventListener('pointerdown', claim, true);
      frame.removeEventListener('focusin', claim);
    };
  }, [frameRef, enabled]);
};
