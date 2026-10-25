import type { RippleOrigin } from '../core.types';

/** A ripple centred on the touch point, big enough to reach the element's farthest corner. */
export const getRippleOrigin = (x: number, y: number, width: number, height: number): RippleOrigin => ({
  x,
  y,
  radius: Math.hypot(Math.max(x, width - x), Math.max(y, height - y)),
});
