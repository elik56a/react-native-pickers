import { PickerSheet, useDraft } from '../sheet/PickerSheet';
import { SheetContent } from '../sheet/SheetContent';
import { TimePicker } from './TimePicker';
import type { TimePickerSheetProps } from './time.types';

export const TimePickerSheet = ({
  visible,
  onClose,
  title,
  confirmLabel,
  cancelLabel,
  showCancel,
  sheetProps,
  theme,
  value,
  onConfirm,
  ...rest
}: TimePickerSheetProps) => {
  const [draft, setDraft] = useDraft(value ?? new Date(), visible);
  return (
    <PickerSheet
      {...{ visible, onClose, title, confirmLabel, cancelLabel, showCancel, sheetProps, theme }}
      onConfirm={() => {
        onConfirm(draft);
        onClose();
      }}
    >
      <SheetContent>
        <TimePicker {...rest} theme={theme} value={draft} onChange={setDraft} />
      </SheetContent>
    </PickerSheet>
  );
};
