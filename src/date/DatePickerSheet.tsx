import { Calendar } from '../calendar/Calendar';
import type { CalendarSelectionProps } from '../calendar/calendar.types';
import { PickerSheet, useDraft } from '../sheet/PickerSheet';
import { SheetContent } from '../sheet/SheetContent';
import { DateWheelPicker } from './DateWheelPicker';
import type { DateDraft, DatePickerSheetProps } from './date.types';
import { getEmptyDraft, isDraftReady } from './date.utils';

export const DatePickerSheet = (props: DatePickerSheetProps) => {
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
  } = props;
  // The sheet holds whichever value shape the mode uses; `mode` ties value, draft and onConfirm together.
  const confirmDraft = onConfirm as (draft: DateDraft) => void;
  const [draft, setDraft] = useDraft<DateDraft>(value ?? getEmptyDraft(mode, display), visible);
  const ready = isDraftReady(mode, draft);
  const confirmsOnSelect = !!confirmOnSelect && mode === 'single' && display === 'calendar';

  const confirm = () => {
    if (!ready) return;
    confirmDraft(draft);
    onClose();
  };

  const onCalendarChange = (next: DateDraft) => {
    setDraft(next);
    if (confirmsOnSelect) {
      confirmDraft(next);
      onClose();
    }
  };

  const selectionProps = {
    mode,
    value: draft,
    onChange: onCalendarChange,
  } as CalendarSelectionProps;

  return (
    <PickerSheet
      {...{ visible, onClose, title, confirmLabel, cancelLabel, showCancel, sheetProps, theme }}
      onConfirm={confirmsOnSelect ? undefined : confirm}
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
          <Calendar {...calendarProps} {...selectionProps} theme={theme} />
        </SheetContent>
      )}
    </PickerSheet>
  );
};
