import { getEyeDropper } from '../color.utils';

/** Picks a colour from the screen with the browser's eyedropper, or null where the browser has none. */
export const useEyeDropper = (onPick: (color: string) => void) => {
  const open = getEyeDropper();
  if (!open) return null;
  return async () => {
    try {
      onPick(await open());
    } catch {
      // Escape closes the eyedropper without a colour.
    }
  };
};
