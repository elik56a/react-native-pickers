import type { RefObject } from 'react';
import { useEffect } from 'react';

import { pinOver } from '../device.utils';

/** The page shows two devices; a sheet belongs to the one the visitor last touched. */
let activeFrame: HTMLElement | null = null;

/** Which device each pinned portal opened in, kept on the element so it survives the hook re-running or react-native-web re-adding it. */
const portalFrames = new WeakMap<Element, HTMLElement>();

/** The portals open in `frame` right now: the ones still on the page. */
const openPortals = (frame: HTMLElement) => Array.from(document.body.children).filter((node) => portalFrames.get(node) === frame);

/**
 * react-native-web portals every Modal into a bare <div> appended to <body>. Pinning those over the phone (the transform makes the
 * modal's `position: fixed` relative to it) opens sheets inside the device instead of over the whole page.
 */
// ponytail: the pin is measured once on open, so resizing the window while a sheet is open leaves it misplaced until it reopens
export const usePortalsInside = (frameRef: RefObject<HTMLDivElement | null>, enabled: boolean) => {
  useEffect(() => {
    const frame = frameRef.current;
    if (!enabled || !frame) return;
    const owns = (target: Node) => frame.contains(target) || openPortals(frame).some((node) => node.contains(target));
    // A touch on the phone or a sheet it opened claims the next portal; a touch anywhere else, like the props panel, lets it go.
    // Focus only claims, so focus landing outside never takes a claim away.
    const track = (e: Event) => {
      const target = e.target as Node;
      if (e.type === 'focusin') {
        if (frame.contains(target)) activeFrame = frame;
      } else if (owns(target)) activeFrame = frame;
      else if (activeFrame === frame) activeFrame = null;
    };
    // react-native-web's Modal pulls focus back into an open sheet whenever it leaves, scrolling the page back to the phone. A sheet
    // in a phone only owns the phone, so focus moving elsewhere on the page stops here, before the Modal's document listener sees it.
    const release = (e: FocusEvent) => {
      if (e.target instanceof Node && openPortals(frame).length && !owns(e.target)) e.stopPropagation();
    };
    document.addEventListener('pointerdown', track, true);
    document.addEventListener('focusin', track, true);
    window.addEventListener('focus', release, true);
    const observer = new MutationObserver((mutations) => {
      if (activeFrame !== frame) return;
      for (const node of mutations.flatMap((m) => Array.from(m.addedNodes))) {
        if (node instanceof HTMLDivElement && !node.attributes.length) {
          pinOver(node, frame);
          portalFrames.set(node, frame);
        }
      }
    });
    observer.observe(document.body, { childList: true });
    return () => {
      observer.disconnect();
      document.removeEventListener('pointerdown', track, true);
      document.removeEventListener('focusin', track, true);
      window.removeEventListener('focus', release, true);
    };
  }, [frameRef, enabled]);
};
