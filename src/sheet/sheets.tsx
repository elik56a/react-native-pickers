import type { EmojiPickerProps } from '../emoji/EmojiPicker';
import { EmojiPicker } from '../emoji/EmojiPicker';
import type { SheetChromeProps } from './PickerSheet';
import { PickerSheet } from './PickerSheet';

export type EmojiPickerSheetProps = SheetChromeProps &
  Omit<EmojiPickerProps, 'theme'> & {
    /** Close after picking an emoji. Default: true */
    closeOnSelect?: boolean;
  };

export function EmojiPickerSheet({
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
  height = 420,
  ...rest
}: EmojiPickerSheetProps) {
  return (
    <PickerSheet {...{ visible, onClose, title, confirmLabel, cancelLabel, showCancel, sheetProps, theme }}>
      <EmojiPicker
        {...rest}
        height={height}
        theme={theme}
        onSelect={(ch, e) => {
          onSelect(ch, e);
          if (closeOnSelect) onClose();
        }}
      />
    </PickerSheet>
  );
}
