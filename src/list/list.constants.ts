import type { ViewStyle } from 'react-native';

import type { Design } from '../core/theme/theme.types';
import type { HorizontalListIconPosition, ListDesign } from './list.types';

export const HORIZONTAL_LIST_VARIANT = {
  segmented: 'segmented',
  chips: 'chips',
} as const;

export const ICON_POSITION = {
  left: 'left',
  right: 'right',
  top: 'top',
  bottom: 'bottom',
} as const;

/** The item's direction that puts its icon (rendered first) on that side of the label. */
export const ICON_POSITION_DIRECTION: Record<HorizontalListIconPosition, ViewStyle['flexDirection']> = {
  left: 'row',
  right: 'row-reverse',
  top: 'column',
  bottom: 'column-reverse',
};

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
