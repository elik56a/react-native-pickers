import { usePickerTheme } from '../core';
import { BottomSheet } from './BottomSheet';
import { SheetButton } from './components/SheetButton';
import { DEFAULT_CANCEL_LABEL, DEFAULT_CONFIRM_LABEL } from './sheet.constants';
import type { PickerSheetProps } from './sheet.types';

/** BottomSheet with Cancel / Done header buttons. */
export const PickerSheet = ({
  visible,
  onClose,
  onConfirm,
  confirmDisabled,
  title,
  confirmLabel = DEFAULT_CONFIRM_LABEL,
  cancelLabel = DEFAULT_CANCEL_LABEL,
  showCancel = true,
  sheetProps,
  theme: themeOverride,
  children,
}: PickerSheetProps) => {
  const theme = usePickerTheme(themeOverride);
  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={title}
      theme={themeOverride}
      headerLeft={showCancel ? <SheetButton label={cancelLabel} onPress={onClose} theme={theme} /> : undefined}
      headerRight={
        onConfirm ? <SheetButton label={confirmLabel} onPress={onConfirm} primary disabled={confirmDisabled} theme={theme} /> : undefined
      }
      {...sheetProps}
    >
      {children}
    </BottomSheet>
  );
};
