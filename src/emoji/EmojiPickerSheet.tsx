import { PickerSheet } from '../sheet/PickerSheet';
import { EmojiPicker } from './EmojiPicker';
import { DEFAULT_SHEET_HEIGHT } from './emoji.constants';
import type { EmojiPickerSheetProps } from './emoji.types';

export const EmojiPickerSheet = ({
  visible,
  onClose,
  title,
  confirmLabel,
  cancelLabel,
  showCancel = false,
  sheetProps,
  theme,
  closeOnSelect = true,
  onSelect,
  height = DEFAULT_SHEET_HEIGHT,
  ...rest
}: EmojiPickerSheetProps) => (
  <PickerSheet {...{ visible, onClose, title, confirmLabel, cancelLabel, showCancel, sheetProps, theme }}>
    <EmojiPicker
      {...rest}
      height={height}
      theme={theme}
      onSelect={(char, data) => {
        onSelect(char, data);
        if (closeOnSelect) onClose();
      }}
    />
  </PickerSheet>
);
