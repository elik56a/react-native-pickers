import type { ClientModule } from '@docusaurus/types';

// Live examples render in the browser only, after the page loads: a #heading isn't there when the browser looks for it,
// and once it is, examples above it keep growing as they render. So follow the target until the page settles,
// and hand scrolling back to the reader the moment they scroll, tap or type.
const SETTLE_MS = 3000;
const READER_EVENTS = ['wheel', 'touchstart', 'keydown', 'mousedown'] as const;

let stopFollowing: (() => void) | undefined;

const followHash = (hash: string) => {
  stopFollowing?.();
  const id = decodeURIComponent(hash.slice(1));
  const until = performance.now() + SETTLE_MS;
  let placedAt: number | undefined;
  let frame = 0;

  const stop = () => {
    cancelAnimationFrame(frame);
    for (const type of READER_EVENTS) window.removeEventListener(type, stop);
    stopFollowing = undefined;
  };

  // Each frame: once the target exists, scroll to it, and again whenever content above moves it.
  const follow = () => {
    const target = document.getElementById(id);
    if (target && (placedAt === undefined || Math.abs(target.getBoundingClientRect().top - placedAt) > 1)) {
      target.scrollIntoView();
      placedAt = target.getBoundingClientRect().top;
    }
    if (performance.now() < until) frame = requestAnimationFrame(follow);
    else stop();
  };

  for (const type of READER_EVENTS) window.addEventListener(type, stop, { passive: true });
  stopFollowing = stop;
  follow();
};

const hashScroll: ClientModule = {
  onRouteDidUpdate({ location, previousLocation }) {
    // Links within a page already scroll; only a page opened at a #heading needs following.
    if (location.hash && location.pathname !== previousLocation?.pathname) followHash(location.hash);
  },
};

export default hashScroll;
