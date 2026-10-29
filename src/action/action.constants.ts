import type { Design } from '../core/theme/theme.types';
import type { ActionSheetDesign, MenuDesign } from './action.types';

/** iOS floats the actions in a rounded card with Cancel in its own card below; Material and the web list them on the sheet. */
export const ACTION_SHEET_DESIGN: Record<Design, ActionSheetDesign> = {
  ios: { grouped: true, showCancel: true, rowHeight: 57 },
  material: { grouped: false, showCancel: false, rowHeight: 56 },
  web: { grouped: false, showCancel: false, rowHeight: 44 },
};

export const CHECK_MARK = '✓';

/** Space around the iOS cards and between the actions card and Cancel. */
export const GROUP_GAP = 8;

export const MENU_ALIGN = {
  auto: 'auto',
  start: 'start',
  end: 'end',
} as const;

export const MENU_PRESENTATION = {
  menu: 'menu',
  sheet: 'sheet',
} as const;

/** iOS menus are wider, with icons after the label and hairlines between actions; Material and web menus are compact, icons first. */
export const MENU_DESIGN: Record<Design, MenuDesign> = {
  ios: { width: 250, rowHeight: 44, iconAtEnd: true, separators: true, centeredTitle: true },
  material: { width: 200, rowHeight: 48, iconAtEnd: false, separators: false, centeredTitle: false },
  web: { width: 200, rowHeight: 36, iconAtEnd: false, separators: false, centeredTitle: false },
};
