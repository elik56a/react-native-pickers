import { useCallback, useState } from 'react';

import type { PickerFieldBaseProps } from '../sheet.types';

/** Whether the field's sheet is open; opening does nothing while `disabled`. */
export const usePickerField = ({ disabled, onOpen, onClose }: Pick<PickerFieldBaseProps, 'disabled' | 'onOpen' | 'onClose'>) => {
  const [open, setOpen] = useState(false);

  const show = useCallback(() => {
    if (disabled) return;
    setOpen(true);
    onOpen?.();
  }, [disabled, onOpen]);

  const hide = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);

  return {
    open,
    show,
    hide,
  };
};
