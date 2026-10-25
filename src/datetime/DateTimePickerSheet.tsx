import { PickerSheet, useDraft } from '../sheet';
import { SheetContent } from '../sheet/SheetContent';
import { DateTimePicker } from './DateTimePicker';
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
  theme,
  value,
  onConfirm,
  ...rest
}: DateTimePickerSheetProps) => {
  const [draft, setDraft] = useDraft(value ?? new Date(), visible);
  return (
    <PickerSheet
      {...{ visible, onClose, title, confirmLabel, cancelLabel, showCancel, presentation, sheetProps, theme }}
      onConfirm={() => {
        onConfirm(draft);
        onClose();
      }}
    >
      <SheetContent compact={rest.display === 'calendar'}>
        <DateTimePicker {...rest} theme={theme} value={draft} onChange={setDraft} />
      </SheetContent>
    </PickerSheet>
  );
};
