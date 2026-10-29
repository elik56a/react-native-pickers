import { useDesignOverride } from '../core/theme/ThemeProvider';
import { clampDate, startOfMonth } from '../core/utils/date.utils';
import { PickerSheet, useDraft } from '../sheet';
import { SheetContent } from '../sheet/SheetContent';
import { MonthPicker } from './MonthPicker';
import type { MonthPickerSheetProps } from './month.types';

export const MonthPickerSheet = ({
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
}: MonthPickerSheetProps) => {
  const theme = useDesignOverride(themeProp, design);
  const [draft, setDraft] = useDraft(startOfMonth(clampDate(value ?? new Date(), rest.minDate, rest.maxDate)), visible, {
    commit: onConfirm,
  });
  return (
    <PickerSheet
      {...{ visible, onClose, title, confirmLabel, cancelLabel, showCancel, presentation, sheetProps, theme }}
      onConfirm={() => {
        onConfirm(draft);
        onClose();
      }}
    >
      <SheetContent>
        <MonthPicker {...rest} theme={theme} value={draft} onChange={setDraft} />
      </SheetContent>
    </PickerSheet>
  );
};
