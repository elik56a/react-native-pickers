import type { RefObject } from 'react';
import { useEffect } from 'react';

/**
 * Fades `[data-reveal]` elements up as they scroll into view. The hidden state only applies once this has run, so content stays
 * visible without JavaScript, and nothing is hidden for people who prefer reduced motion.
 */
export const useScrollReveal = (rootRef: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-revealed', '');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.1 }
    );
    for (const target of Array.from(root.querySelectorAll('[data-reveal]'))) observer.observe(target);
    root.setAttribute('data-reveal-ready', '');
    return () => observer.disconnect();
  }, [rootRef]);
};
