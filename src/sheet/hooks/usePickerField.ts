import { useCallback, useMemo, useState } from 'react';

import { usePickerPlatform } from '../../core/theme/ThemeProvider';
import { FIELD_PRESENTATION } from '../sheet.constants';
import type { FieldPresentation, FieldSheetContextValue, PickerFieldBaseProps } from '../sheet.types';
import { resolveFieldPresentation } from '../sheet.utils';
import { useAnchor } from './useAnchor';

/** Whether the field's picker is open, and where; opening does nothing while `disabled`. */
export const usePickerField = ({
  disabled,
  presentation: presentationProp = FIELD_PRESENTATION.auto,
  onOpen,
  onClose,
}: Pick<PickerFieldBaseProps, 'disabled' | 'onOpen' | 'onClose'> & { presentation?: FieldPresentation }) => {
  const [open, setOpen] = useState(false);
  const anchor = useAnchor();
  const presentation = resolveFieldPresentation(presentationProp, usePickerPlatform());
  const dropdown = presentation === FIELD_PRESENTATION.dropdown;

  const show = useCallback(() => {
    if (disabled) return;
    if (dropdown) anchor.measure();
    setOpen(true);
    onOpen?.();
  }, [anchor.measure, disabled, dropdown, onOpen]);

  const hide = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);

  const sheet = useMemo<FieldSheetContextValue>(
    () => ({
      presentation,
      anchor: anchor.rect,
    }),
    [anchor.rect, presentation]
  );

  return {
    open,
    show,
    hide,
    anchor,
    sheet,
  };
};
