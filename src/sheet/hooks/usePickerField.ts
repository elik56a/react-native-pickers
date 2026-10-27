import { useCallback, useMemo, useState } from 'react';

import { FIELD_PRESENTATION } from '../sheet.constants';
import type { FieldPresentation, FieldSheetContextValue, PickerFieldBaseProps } from '../sheet.types';
import { useAnchor } from './useAnchor';

/** Whether the field's picker is open, and where; opening does nothing while `disabled`. */
export const usePickerField = ({
  disabled,
  presentation = FIELD_PRESENTATION.dropdown,
  onOpen,
  onClose,
}: Pick<PickerFieldBaseProps, 'disabled' | 'onOpen' | 'onClose'> & { presentation?: FieldPresentation }) => {
  const [open, setOpen] = useState(false);
  const { ref: anchorRef, anchor, measure } = useAnchor();
  const dropdown = presentation === FIELD_PRESENTATION.dropdown;

  const show = useCallback(() => {
    if (disabled) return;
    if (dropdown) measure();
    setOpen(true);
    onOpen?.();
  }, [disabled, dropdown, measure, onOpen]);

  const hide = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);

  const sheet = useMemo<FieldSheetContextValue>(
    () => ({
      presentation,
      anchor,
    }),
    [anchor, presentation]
  );

  return {
    open,
    show,
    hide,
    anchorRef,
    sheet,
  };
};
