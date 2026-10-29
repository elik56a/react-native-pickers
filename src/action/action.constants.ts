import type { Design } from '../core/theme/theme.types';
import type { ActionSheetDesign } from './action.types';

/** iOS floats the actions in a rounded card with Cancel in its own card below; Material and the web list them on the sheet. */
export const ACTION_SHEET_DESIGN: Record<Design, ActionSheetDesign> = {
  ios: { grouped: true, showCancel: true, rowHeight: 57 },
  material: { grouped: false, showCancel: false, rowHeight: 56 },
  web: { grouped: false, showCancel: false, rowHeight: 44 },
};

export const CHECK_MARK = '✓';

/** Space around the iOS cards and between the actions card and Cancel. */
export const GROUP_GAP = 8;
