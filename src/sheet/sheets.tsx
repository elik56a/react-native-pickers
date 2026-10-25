import type { EmojiPickerProps } from '../emoji/EmojiPicker';
import { EmojiPicker } from '../emoji/EmojiPicker';
import type { TimePickerProps } from '../time/TimePicker';
import { TimePicker } from '../time/TimePicker';
import type { SheetChromeProps } from './PickerSheet';
import { PickerSheet, useDraft } from './PickerSheet';
import { SheetContent } from './SheetContent';

export type TimePickerSheetProps = SheetChromeProps &
  Omit<TimePickerProps, 'value' | 'defaultValue' | 'onChange' | 'theme'> & {
    value?: Date;
    onConfirm: (date: Date) => void;
  };

export function TimePickerSheet({
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
}: TimePickerSheetProps) {
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
}

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
