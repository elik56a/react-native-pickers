import type { CatalogEntry } from './catalog.types';

/** Every prop playground, shown on its docs page and in the example app. */
export const PLAYGROUND = {
  datePicker: 'datePicker',
  datePickerField: 'datePickerField',
  dateRange: 'dateRange',
  dateRangeField: 'dateRangeField',
  dateWheelPicker: 'dateWheelPicker',
  birthdayField: 'birthdayField',
  monthPicker: 'monthPicker',
  monthPickerField: 'monthPickerField',
  weekStrip: 'weekStrip',
  timePicker: 'timePicker',
  timePickerField: 'timePickerField',
  durationPicker: 'durationPicker',
  durationPickerField: 'durationPickerField',
  dateTimePicker: 'dateTimePicker',
  dateTimePickerField: 'dateTimePickerField',
  selectPicker: 'selectPicker',
  selectList: 'selectList',
  countryPicker: 'countryPicker',
  phoneField: 'phoneField',
  timeZonePicker: 'timeZonePicker',
  horizontalList: 'horizontalList',
  wheelPicker: 'wheelPicker',
  wheelPickerField: 'wheelPickerField',
  multiWheelPicker: 'multiWheelPicker',
  emojiPicker: 'emojiPicker',
  emojiPickerField: 'emojiPickerField',
  colorPicker: 'colorPicker',
  colorPickerField: 'colorPickerField',
  slider: 'slider',
  pickerField: 'pickerField',
  pickerSheet: 'pickerSheet',
  bottomSheet: 'bottomSheet',
} as const;

/**
 * The component pages, grouped by what the user picks, not how: a date picker is a calendar or wheels, a time picker wheels,
 * a dial or a list. The docs sidebar and the example app's drawer are both built from it.
 */
export const CATALOG: readonly CatalogEntry[] = [
  {
    label: 'Date & time',
    pages: [
      {
        doc: 'components/date-picker',
        label: 'DatePicker',
        playgrounds: [PLAYGROUND.datePicker, PLAYGROUND.datePickerField],
        // Ranges are a mode of DatePicker, so their page sits under it; it stays a page of its own for search.
        pages: [
          {
            doc: 'components/date-range-picker',
            label: 'Ranges & multiple dates',
            playgrounds: [PLAYGROUND.dateRange, PLAYGROUND.dateRangeField],
          },
        ],
      },
      {
        doc: 'components/date-wheel-picker',
        label: 'DateWheelPicker',
        playgrounds: [PLAYGROUND.dateWheelPicker, PLAYGROUND.birthdayField],
      },
      { doc: 'components/month-picker', label: 'MonthPicker', playgrounds: [PLAYGROUND.monthPicker, PLAYGROUND.monthPickerField] },
      { doc: 'components/week-strip', label: 'WeekStrip', playgrounds: [PLAYGROUND.weekStrip] },
      { doc: 'components/time-picker', label: 'TimePicker', playgrounds: [PLAYGROUND.timePicker, PLAYGROUND.timePickerField] },
      {
        doc: 'components/duration-picker',
        label: 'DurationPicker',
        playgrounds: [PLAYGROUND.durationPicker, PLAYGROUND.durationPickerField],
      },
      {
        doc: 'components/date-time-picker',
        label: 'DateTimePicker',
        playgrounds: [PLAYGROUND.dateTimePicker, PLAYGROUND.dateTimePickerField],
      },
    ],
  },
  {
    label: 'Select',
    pages: [
      { doc: 'components/select-picker', label: 'SelectPicker', playgrounds: [PLAYGROUND.selectPicker] },
      { doc: 'components/select-list', label: 'SelectList', playgrounds: [PLAYGROUND.selectList] },
      { doc: 'components/country-picker', label: 'CountryPicker', playgrounds: [PLAYGROUND.countryPicker] },
      { doc: 'components/phone-field', label: 'PhoneField', playgrounds: [PLAYGROUND.phoneField] },
      { doc: 'components/time-zone-picker', label: 'TimeZonePicker', playgrounds: [PLAYGROUND.timeZonePicker] },
      { doc: 'components/horizontal-list', label: 'HorizontalList', playgrounds: [PLAYGROUND.horizontalList] },
    ],
  },
  {
    label: 'Wheels',
    pages: [
      { doc: 'components/wheel-picker', label: 'WheelPicker', playgrounds: [PLAYGROUND.wheelPicker, PLAYGROUND.wheelPickerField] },
      { doc: 'components/multi-wheel-picker', label: 'MultiWheelPicker', playgrounds: [PLAYGROUND.multiWheelPicker] },
    ],
  },
  { doc: 'components/emoji-picker', label: 'EmojiPicker', playgrounds: [PLAYGROUND.emojiPicker, PLAYGROUND.emojiPickerField] },
  { doc: 'components/color-picker', label: 'ColorPicker', playgrounds: [PLAYGROUND.colorPicker, PLAYGROUND.colorPickerField] },
  { doc: 'components/slider', label: 'Slider', playgrounds: [PLAYGROUND.slider] },
  {
    label: 'Fields & sheets',
    pages: [
      { doc: 'components/picker-fields', label: 'Picker fields', playgrounds: [PLAYGROUND.pickerField] },
      { doc: 'components/picker-sheets', label: 'Picker sheets', playgrounds: [PLAYGROUND.pickerSheet] },
      { doc: 'components/bottom-sheet', label: 'BottomSheet', playgrounds: [PLAYGROUND.bottomSheet] },
    ],
  },
];
