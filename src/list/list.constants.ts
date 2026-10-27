import type { Design } from '../core/theme/theme.types';
import type { ListDesign } from './list.types';

export const HORIZONTAL_LIST_VARIANT = {
  segmented: 'segmented',
  chips: 'chips',
} as const;

export const CHIP_HEIGHT = 34;
export const SEGMENT_HEIGHT = 30;
/** Space between the segmented track's edge and its items. */
export const TRACK_PADDING = 3;
export const SEGMENT_GAP = 2;
export const SEGMENT_THUMB_SHADOW = '0 1px 2px rgba(23, 21, 15, 0.12), 0 1px 1px rgba(23, 21, 15, 0.06)';
export const DISABLED_ITEM_OPACITY = 0.45;

/** Material outlines the segments and chips and marks the chosen one with a check; iOS and the web slide a raised thumb. */
export const LIST_DESIGN: Record<Design, ListDesign> = {
  ios: { outlined: false },
  material: { outlined: true },
  web: { outlined: false },
};
export const OUTLINED_SEGMENT_HEIGHT = 40;
