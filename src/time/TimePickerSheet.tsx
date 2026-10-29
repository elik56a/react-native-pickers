import { useDesignOverride } from '../core/theme/ThemeProvider';
import { PickerSheet, useDraft } from '../sheet';
import { SheetContent } from '../sheet/SheetContent';
import { TimePicker } from './TimePicker';
import type { TimePickerSheetProps } from './time.types';
import { snapTime } from './time.utils';

export const TimePickerSheet = ({
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
}: TimePickerSheetProps) => {
  const theme = useDesignOverride(themeProp, design);
  const commit = (next: Date) => onConfirm(snapTime(next, rest));
  const [draft, setDraft] = useDraft(value ?? new Date(), visible, { commit });
  return (
    <PickerSheet
      {...{ visible, onClose, title, confirmLabel, cancelLabel, showCancel, presentation, sheetProps, theme }}
      onConfirm={() => {
        commit(draft);
        onClose();
      }}
    >
      <SheetContent>
        <TimePicker {...rest} theme={theme} value={draft} onChange={setDraft} />
      </SheetContent>
    </PickerSheet>
  );
};
