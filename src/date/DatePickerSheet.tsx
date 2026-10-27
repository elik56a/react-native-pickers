import { Calendar } from '../calendar/Calendar';
import { CALENDAR_MODE } from '../calendar/calendar.constants';
import type { CalendarSelectionProps } from '../calendar/calendar.types';
import { PICKER_DISPLAY } from '../core/core.constants';
import { useDesignOverride } from '../core/theme/ThemeProvider';
import { PickerSheet, useDraft } from '../sheet';
import { SheetContent } from '../sheet/SheetContent';
import { DateWheelPicker } from './DateWheelPicker';
import type { DateDraft, DatePickerSheetProps } from './date.types';
import { getEmptyDraft, getSheetDisplay, isDraftReady } from './date.utils';

export const DatePickerSheet = (props: DatePickerSheetProps) => {
  const {
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
    display: displayProp = PICKER_DISPLAY.calendar,
    wheelProps,
    confirmOnSelect,
    mode = CALENDAR_MODE.single,
    value,
    onConfirm,
    ...calendarProps
  } = props;
  const theme = useDesignOverride(themeProp, design);
  const display = getSheetDisplay(mode, displayProp);
  // The sheet holds whichever value shape the mode uses; `mode` ties value, draft and onConfirm together.
  const confirmDraft = onConfirm as (draft: DateDraft) => void;
  const [draft, setDraft] = useDraft<DateDraft>(value ?? getEmptyDraft(mode, display), visible);
  const ready = isDraftReady(mode, draft);
  const confirmsOnSelect = !!confirmOnSelect && mode === CALENDAR_MODE.single && display === PICKER_DISPLAY.calendar;

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
      {...{ visible, onClose, title, confirmLabel, cancelLabel, showCancel, presentation, sheetProps, theme }}
      onConfirm={confirmsOnSelect ? undefined : confirm}
      confirmDisabled={!ready}
    >
      {display === PICKER_DISPLAY.wheel ? (
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
