import { PickerSheet, useDraft } from '../sheet';
import { SheetContent } from '../sheet/SheetContent';
import { WheelPicker } from './WheelPicker';
import type { WheelPickerSheetProps } from './wheel.types';
import { firstItemValue } from './wheel.utils';

export const WheelPickerSheet = <T,>({
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
}: WheelPickerSheetProps<T>) => {
  const [draft, setDraft] = useDraft<T>(value ?? (firstItemValue(rest.items) as T), visible);
  return (
    <PickerSheet
      {...{ visible, onClose, title, confirmLabel, cancelLabel, showCancel, presentation, sheetProps, theme }}
      onConfirm={() => {
        onConfirm(draft);
        onClose();
      }}
    >
      <SheetContent>
        <WheelPicker<T> {...rest} theme={theme} value={draft} onChange={setDraft} />
      </SheetContent>
    </PickerSheet>
  );
};
