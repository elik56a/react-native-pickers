import { PICKER_DISPLAY } from '../core/core.constants';
import { useDesignOverride, usePickerTheme } from '../core/theme/ThemeProvider';
import { PickerSheet, useDraft } from '../sheet';
import { SheetContent } from '../sheet/SheetContent';
import { snapTime } from '../time/time.utils';
import { DateTimePicker } from './DateTimePicker';
import { DATETIME_DESIGN } from './datetime.constants';
import type { DateTimePickerSheetProps } from './datetime.types';

export const DateTimePickerSheet = ({
  visible,
  onClose,
  title,
  confirmLabel,
  cancelLabel,
  showCancel,
  presentation,
  sheetProps,
  theme: themeProp,
  design,
  value,
  onConfirm,
  ...rest
}: DateTimePickerSheetProps) => {
  const theme = useDesignOverride(themeProp, design);
  const [draft, setDraft] = useDraft(value ?? new Date(), visible);
  const { design: resolvedDesign } = usePickerTheme(theme);
  const display = rest.display ?? DATETIME_DESIGN[resolvedDesign].display;
  return (
    <PickerSheet
      {...{ visible, onClose, title, confirmLabel, cancelLabel, showCancel, presentation, sheetProps, theme }}
      onConfirm={() => {
        onConfirm(snapTime(draft, rest));
        onClose();
      }}
    >
      <SheetContent compact={display === PICKER_DISPLAY.calendar}>
        <DateTimePicker {...rest} theme={theme} value={draft} onChange={setDraft} />
      </SheetContent>
    </PickerSheet>
  );
};
