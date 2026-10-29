import { Calendar } from '../calendar/Calendar';
import { CALENDAR_MODE } from '../calendar/calendar.constants';
import type { CalendarSelectionProps } from '../calendar/calendar.types';
import { PICKER_DISPLAY } from '../core/core.constants';
import { useDesignOverride, usePickerTheme } from '../core/theme/ThemeProvider';
import { PickerSheet, useDraft } from '../sheet';
import { SheetContent } from '../sheet/SheetContent';
import { DateHeadline } from './components/DateHeadline';
import { DateWheelPicker } from './DateWheelPicker';
import { DATE_HEADLINE } from './date.constants';
import type { DateDraft, DatePickerSheetProps } from './date.types';
import { formatDateHeadline, getEmptyDraft, getSheetDisplay, isDraftReady } from './date.utils';

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
  // The sheet holds whichever value shape the mode uses; `mode` ties value, draft and onConfirm together, so a new mode starts a new draft.
  const confirmDraft = onConfirm as (draft: DateDraft) => void;
  const confirmsOnSelect = !!confirmOnSelect && mode === CALENDAR_MODE.single && display === PICKER_DISPLAY.calendar;
  // Inline, a range commits once both ends are picked; confirmOnSelect commits on its own.
  const commit = (next: DateDraft) => {
    if (isDraftReady(mode, next)) confirmDraft(next);
  };
  const [draft, setDraft] = useDraft<DateDraft>(value ?? getEmptyDraft(mode, display), visible, {
    resetKey: mode,
    commit: confirmsOnSelect ? undefined : commit,
  });
  const ready = isDraftReady(mode, draft);
  const resolved = usePickerTheme(theme);
  const headline =
    DATE_HEADLINE[resolved.design] && display === PICKER_DISPLAY.calendar ? formatDateHeadline(mode, draft, calendarProps.locale) : null;

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
          {headline ? <DateHeadline text={headline} theme={resolved} /> : null}
          <Calendar {...calendarProps} {...selectionProps} theme={theme} />
        </SheetContent>
      )}
    </PickerSheet>
  );
};
