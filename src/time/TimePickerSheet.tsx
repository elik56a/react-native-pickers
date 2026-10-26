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
  theme,
  value,
  onConfirm,
  ...rest
}: TimePickerSheetProps) => {
  const [draft, setDraft] = useDraft(value ?? new Date(), visible);
  return (
    <PickerSheet
      {...{ visible, onClose, title, confirmLabel, cancelLabel, showCancel, presentation, sheetProps, theme }}
      onConfirm={() => {
        onConfirm(snapTime(draft, rest));
        onClose();
      }}
    >
      <SheetContent>
        <TimePicker {...rest} theme={theme} value={draft} onChange={setDraft} />
      </SheetContent>
    </PickerSheet>
  );
};
