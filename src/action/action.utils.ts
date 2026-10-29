import type { AnchorRect } from '../sheet/sheet.types';
import { MENU_ALIGN } from './action.constants';
import type { MenuAlign } from './action.types';

/** The rect the menu drops from: the trigger, widened to the menu and lined up with its left or right edge. */
export const getMenuAnchor = (trigger: AnchorRect, width: number, align: MenuAlign, windowWidth: number, rtl: boolean): AnchorRect => {
  const rightEdge = align === MENU_ALIGN.auto ? trigger.x + trigger.width / 2 > windowWidth / 2 : (align === MENU_ALIGN.end) !== rtl;
  return {
    ...trigger,
    x: rightEdge ? trigger.x + trigger.width - width : trigger.x,
    width,
  };
};
