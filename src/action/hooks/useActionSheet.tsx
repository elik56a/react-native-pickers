import { useCallback, useState } from 'react';

import { ActionSheet } from '../ActionSheet';
import type { ActionSheetController, ActionSheetOptions } from '../action.types';

/** Shows an action sheet from a call, like `showActionSheetWithOptions`: render the returned `actionSheet` once. */
export const useActionSheet = (): ActionSheetController => {
  const [options, setOptions] = useState<ActionSheetOptions | null>(null);
  const [visible, setVisible] = useState(false);
  const show = useCallback((next: ActionSheetOptions) => {
    setOptions(next);
    setVisible(true);
  }, []);
  const hide = useCallback(() => setVisible(false), []);
  const onClose = () => {
    hide();
    options?.onClose?.();
  };

  return {
    show,
    hide,
    actionSheet: options ? <ActionSheet {...options} visible={visible} onClose={onClose} /> : null,
  };
};
