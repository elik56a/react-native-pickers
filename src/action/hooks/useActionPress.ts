import { useRef } from 'react';

import type { ActionPress, ActionSheetAction } from '../action.types';

/** Closes the sheet on a press and runs the action once it's gone, so the action can present another modal (iOS shows one at a time). */
export const useActionPress = (onClose: () => void, onClosed?: () => void): ActionPress => {
  const pending = useRef<ActionSheetAction | null>(null);
  return {
    press: (action) => {
      pending.current = action;
      onClose();
    },
    onClosed: () => {
      const action = pending.current;
      pending.current = null;
      onClosed?.();
      action?.onPress?.();
    },
  };
};
