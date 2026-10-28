import { useDesignOverride } from '../core/theme/ThemeProvider';
import { PickerSheet } from '../sheet';
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
  presentation,
  sheetProps,
  theme: themeProp,
  design,
  closeOnSelect = true,
  onSelect,
  height = DEFAULT_SHEET_HEIGHT,
  ...rest
}: EmojiPickerSheetProps) => {
  const theme = useDesignOverride(themeProp, design);
  return (
    <PickerSheet {...{ visible, onClose, title, confirmLabel, cancelLabel, showCancel, presentation, sheetProps, theme }}>
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
};
