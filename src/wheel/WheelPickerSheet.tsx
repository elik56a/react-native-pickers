import { useDesignOverride } from '../core/theme/ThemeProvider';
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
  theme: themeProp,
  design,
  value,
  onConfirm,
  ...rest
}: WheelPickerSheetProps<T>) => {
  const theme = useDesignOverride(themeProp, design);
  const [draft, setDraft] = useDraft<T>(value ?? (firstItemValue(rest.items) as T), visible, { commit: onConfirm });
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
