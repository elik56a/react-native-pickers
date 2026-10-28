import { useDesignOverride } from '../core/theme/ThemeProvider';
import { PickerSheet, useDraft } from '../sheet';
import { SheetContent } from '../sheet/SheetContent';
import { DurationPicker } from './DurationPicker';
import type { DurationPickerSheetProps } from './duration.types';
import { snapDuration } from './duration.utils';

export const DurationPickerSheet = ({
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
}: DurationPickerSheetProps) => {
  const theme = useDesignOverride(themeProp, design);
  const [draft, setDraft] = useDraft(snapDuration(value ?? 0, rest), visible);
  return (
    <PickerSheet
      {...{ visible, onClose, title, confirmLabel, cancelLabel, showCancel, presentation, sheetProps, theme }}
      onConfirm={() => {
        onConfirm(draft);
        onClose();
      }}
    >
      <SheetContent>
        <DurationPicker {...rest} theme={theme} value={draft} onChange={setDraft} />
      </SheetContent>
    </PickerSheet>
  );
};
