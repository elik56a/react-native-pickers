import type { CalendarBaseProps, DateRange } from '../date/Calendar';
import { Calendar } from '../date/Calendar';
import type { DateWheelPickerProps } from '../date/DateWheelPicker';
import { DateWheelPicker } from '../date/DateWheelPicker';
import type { EmojiPickerProps } from '../emoji/EmojiPicker';
import { EmojiPicker } from '../emoji/EmojiPicker';
import type { TimePickerProps } from '../time/TimePicker';
import { TimePicker } from '../time/TimePicker';
import type { SheetChromeProps } from './PickerSheet';
import { PickerSheet, useDraft } from './PickerSheet';
import { SheetContent } from './SheetContent';

type DateSheetSelection =
  | { mode?: 'single'; value?: Date | null; onConfirm: (date: Date) => void }
  | { mode: 'range'; value?: DateRange; onConfirm: (range: DateRange) => void; minRangeDays?: number; maxRangeDays?: number }
  | { mode: 'multiple'; value?: Date[]; onConfirm: (dates: Date[]) => void; maxSelections?: number };

export type DatePickerSheetProps = SheetChromeProps &
  Omit<CalendarBaseProps, 'theme'> &
  DateSheetSelection & {
    /** 'calendar' (default) or 'wheel' (single mode only) */
    display?: 'calendar' | 'wheel';
    wheelProps?: Partial<DateWheelPickerProps>;
    /** Single mode: confirm as soon as a day is tapped. Default: false */
    confirmOnSelect?: boolean;
  };

export function DatePickerSheet(props: DatePickerSheetProps) {
  const {
    visible,
    onClose,
    title,
    confirmLabel,
    cancelLabel,
    showCancel,
    sheetProps,
    theme,
    display = 'calendar',
    wheelProps,
    confirmOnSelect,
    mode = 'single',
    value,
    onConfirm,
    ...calendarProps
  } = props as DatePickerSheetProps & { value?: unknown; onConfirm: (v: unknown) => void };
  const empty = mode === 'range' ? { start: null, end: null } : mode === 'multiple' ? [] : null;
  const [draft, setDraft] = useDraft<unknown>(value ?? (display === 'wheel' ? new Date() : empty), visible);

  const ready =
    mode === 'single' ? draft instanceof Date : mode === 'range' ? !!(draft as DateRange).start && !!(draft as DateRange).end : true;
  const confirm = () => {
    if (!ready) return;
    onConfirm(draft);
    onClose();
  };

  return (
    <PickerSheet
      visible={visible}
      onClose={onClose}
      title={title}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      showCancel={showCancel}
      sheetProps={sheetProps}
      theme={theme}
      onConfirm={confirmOnSelect && mode === 'single' && display === 'calendar' ? undefined : confirm}
      confirmDisabled={!ready}
    >
      {display === 'wheel' ? (
        <SheetContent>
          <DateWheelPicker
            {...wheelProps}
            locale={calendarProps.locale}
            minDate={calendarProps.minDate}
            maxDate={calendarProps.maxDate}
            theme={theme}
            value={draft as Date}
            onChange={setDraft}
          />
        </SheetContent>
      ) : (
        <SheetContent compact>
          <Calendar
            {...(calendarProps as CalendarBaseProps)}
            theme={theme}
            {...({
              mode,
              value: draft,
              onChange: (v: unknown) => {
                setDraft(v);
                if (confirmOnSelect && mode === 'single') {
                  onConfirm(v);
                  onClose();
                }
              },
            } as object)}
          />
        </SheetContent>
      )}
    </PickerSheet>
  );
}

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
