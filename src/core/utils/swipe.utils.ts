import { SWIPE } from '../core.constants';

export const isHorizontalSwipe = (dx: number, dy: number) =>
  Math.abs(dx) > SWIPE.activateDistance && Math.abs(dx) > Math.abs(dy) * SWIPE.directionRatio;

/** Page delta for a released swipe: swiping left goes forward, mirrored in RTL; 0 when too short and slow. */
export const getSwipeDelta = (dx: number, vx: number, rtl: boolean) => {
  if (Math.abs(dx) <= SWIPE.minDistance && Math.abs(vx) <= SWIPE.minVelocity) return 0;
  const delta = dx < 0 ? 1 : -1;
  return rtl ? -delta : delta;
};
