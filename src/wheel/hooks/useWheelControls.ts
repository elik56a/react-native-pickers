import { useCallback } from 'react';
import type { AccessibilityActionEvent } from 'react-native';

import { A11Y_ACTION, ADJUSTABLE_ACTIONS, KEY } from '../../core/core.constants';
import { keyboardProps } from '../../core/utils/keyboard.utils';
import type { WheelControlsOptions } from '../wheel.types';

/**
 * A press on a row scrolls to it, or types on the selected one. Arrow keys and the screen reader's adjust move one row,
 * up to the row above; Home and End go to the ends.
 */
export const useWheelControls = ({ wheel, toggleTyping, keyboardInput, disabled, count }: WheelControlsOptions) => {
  const { active, move, scrollToData, scrollToLogical } = wheel;
  const onRowPress = useCallback(
    (dataIndex: number) => {
      if (keyboardInput && dataIndex === active) toggleTyping();
      else scrollToData(dataIndex, true);
    },
    [active, keyboardInput, scrollToData, toggleTyping]
  );

  return {
    onRowPress: disabled ? undefined : onRowPress,
    controlProps: {
      accessibilityActions: ADJUSTABLE_ACTIONS,
      onAccessibilityAction: (e: AccessibilityActionEvent) => move(e.nativeEvent.actionName === A11Y_ACTION.increment ? 1 : -1),
      ...(disabled
        ? null
        : keyboardProps({
            [KEY.up]: () => move(-1),
            [KEY.down]: () => move(1),
            [KEY.home]: () => scrollToLogical(0, true),
            [KEY.end]: () => scrollToLogical(count - 1, true),
          })),
    },
  };
};
