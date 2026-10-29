import type { AccessibilityActionEvent } from 'react-native';

import { A11Y_ACTION, ADJUSTABLE_ACTIONS, KEY } from '../core.constants';
import type { AdjustableOptions } from '../core.types';
import { keyboardProps } from './keyboard.utils';

/**
 * Screen-reader adjust actions and keys for a control that moves in steps, a slider's thumb: `onStep(1)` on increment,
 * right and up, `onStep(-1)` on decrement, left and down. Home and End go to the ends; Page Up and Down call `onPage`.
 */
export const adjustableProps = ({ label, valueText, disabled = false, onStep, onPage, onMin, onMax }: AdjustableOptions) => ({
  accessible: true,
  accessibilityRole: 'adjustable' as const,
  accessibilityLabel: label,
  accessibilityValue: { text: valueText },
  accessibilityState: { disabled },
  accessibilityActions: ADJUSTABLE_ACTIONS,
  onAccessibilityAction: (e: AccessibilityActionEvent) => {
    if (!disabled) onStep(e.nativeEvent.actionName === A11Y_ACTION.increment ? 1 : -1);
  },
  ...(disabled
    ? {}
    : keyboardProps({
        [KEY.right]: () => onStep(1),
        [KEY.up]: () => onStep(1),
        [KEY.left]: () => onStep(-1),
        [KEY.down]: () => onStep(-1),
        [KEY.pageUp]: onPage && (() => onPage(1)),
        [KEY.pageDown]: onPage && (() => onPage(-1)),
        [KEY.home]: onMin,
        [KEY.end]: onMax,
      })),
});
