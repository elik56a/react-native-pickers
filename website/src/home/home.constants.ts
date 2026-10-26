import type { CompareRow, Support } from './home.types';

export const PACKAGE = '@elik56a/react-native-pickers';
export const INSTALL = `npm install ${PACKAGE}`;
export const NPM_PACKAGE_URL = `https://www.npmjs.com/package/${PACKAGE}`;
/** Predates the first publish, so the range covers every download. */
export const NPM_DOWNLOADS_SINCE = '2020-01-01';

export const NPM_DOWNLOADS_STATUS = {
  loading: 'loading',
  unavailable: 'unavailable',
} as const;

export const PAGE_TITLE = 'Date, Time, Wheel, Select & Emoji Pickers';
export const PAGE_DESCRIPTION =
  'Wheel, time, date, calendar, range, select and emoji pickers for React Native, with bottom sheets. 100% JavaScript, zero native code. Expo Go, bare RN and React Native Web.';

export const COUNT_UP_MS = 1400;
export const COPIED_MS = 1500;
export const REVEAL_STEP_MS = 90;

export const FEATURES = [
  {
    title: 'Zero native code',
    body: 'Pure JavaScript. Runs in Expo Go, bare React Native and React Native Web with no pod install or rebuild.',
  },
  {
    title: 'Themeable to the pixel',
    body: 'Design tokens, automatic dark mode, a typed style slot for every part, and render props when you need full control.',
  },
  {
    title: 'Ranges, built in',
    body: 'Single, range and multiple date selection with min/max nights, disabled days, prices and dots, all with no marking logic to write.',
  },
  {
    title: 'Any locale, RTL',
    body: 'Month, weekday and AM/PM names, the 12/24h clock, week start and date order all come from Intl. Layouts mirror for RTL.',
  },
  {
    title: 'Accessible',
    body: 'Adjustable wheels for VoiceOver and TalkBack, fully labelled days, and selected and disabled states everywhere.',
  },
  { title: 'Fast', body: 'Native-driver animations, virtualized fixed-layout lists and memoized rows keep it at 60 fps.' },
];

export const COMPONENTS = [
  { doc: 'components/wheel-picker', name: 'WheelPicker', body: '3D wheel, loop, disabled rows, tap-to-type' },
  { doc: 'components/time-picker', name: 'TimePicker', body: '12/24h from locale, intervals, min/max' },
  { doc: 'components/date-picker', name: 'DatePicker', body: 'Calendar or wheel, marked dates, i18n' },
  { doc: 'components/date-time-picker', name: 'DateTimePicker', body: 'Day + time wheel, or calendar + time' },
  { doc: 'components/date-range-picker', name: 'Date range', body: 'Check-in/out, min/max nights, multiple' },
  { doc: 'components/select-picker', name: 'SelectPicker', body: 'Search, groups, icons, multi-select chips' },
  { doc: 'components/emoji-picker', name: 'EmojiPicker', body: '1,906 emojis, skin tones, recents, search' },
  { doc: 'components/multi-wheel-picker', name: 'MultiWheelPicker', body: 'Durations, units, dependent columns' },
  { doc: 'components/picker-sheets', name: 'Sheets', body: 'Every picker in a bottom sheet with Done' },
  { doc: 'components/picker-fields', name: 'Fields', body: 'Tap a form field, pick, see the value' },
];

export const HERO_CHIPS = [
  { icon: '📦', text: 'Zero native deps' },
  { icon: '🌙', text: 'Dark mode built in' },
  { icon: '⚡', text: '60 fps wheels' },
  { icon: '🌍', text: 'Any locale, RTL' },
];

/** The chips pop in after the hero copy, one every other reveal step. */
export const HERO_CHIPS_FIRST_STEP = 6;

export const STATS = [
  { value: COMPONENTS.length, label: 'components' },
  { value: 0, label: 'native modules' },
  { value: 1906, label: 'emojis' },
  { value: 100, suffix: '%', label: 'TypeScript' },
];

export const SAMPLE = `import { DatePicker, DatePickerSheet } from '@elik56a/react-native-pickers';

// inline calendar
<DatePicker value={date} onChange={setDate} minDate={new Date()} />

// range in a bottom sheet: commits on Done
<DatePickerSheet
  visible={open}
  onClose={() => setOpen(false)}
  mode="range"
  value={range}
  onConfirm={setRange}
/>`;

export const SUPPORT = {
  yes: 'yes',
  partial: 'partial',
  no: 'no',
} as const;

export const SUPPORT_LABEL: Record<Support, string> = { yes: 'Yes', partial: 'Partly', no: 'No' };

export const COMPARE_COLUMNS = [
  { name: 'React Native Pickers', examples: 'this library' },
  { name: 'Native OS pickers', examples: '@react-native-community/datetimepicker, @react-native-picker/picker' },
  { name: 'Calendar libraries', examples: 'react-native-calendars' },
  { name: 'Select wrappers', examples: 'react-native-picker-select' },
];

const { yes, partial, no } = SUPPORT;

export const COMPARE_ROWS: CompareRow[] = [
  {
    feature: 'Wheel, time and date pickers',
    cells: [{ support: yes }, { support: yes, note: 'OS styling' }, { support: partial, note: 'Calendar only' }, { support: no }],
  },
  {
    feature: 'Date ranges and multiple dates',
    cells: [{ support: yes, note: 'Built in' }, { support: no }, { support: partial, note: 'Manual marking' }, { support: no }],
  },
  {
    feature: 'Searchable select and multi-select',
    cells: [{ support: yes }, { support: no }, { support: no }, { support: partial, note: 'Varies' }],
  },
  {
    feature: 'Emoji picker',
    cells: [{ support: yes }, { support: no }, { support: no }, { support: no }],
  },
  {
    feature: 'Bottom sheets',
    cells: [{ support: yes, note: 'Built in' }, { support: no }, { support: no }, { support: no }],
  },
  {
    feature: 'Same UI on iOS, Android and web',
    cells: [{ support: yes }, { support: no }, { support: yes }, { support: no }],
  },
  {
    feature: 'Theming and dark mode',
    cells: [
      { support: yes, note: 'Tokens + slots' },
      { support: partial, note: 'Limited' },
      { support: yes },
      { support: partial, note: 'Limited' },
    ],
  },
  {
    feature: 'No native code',
    cells: [{ support: yes }, { support: no }, { support: yes, note: 'Usually' }, { support: no }],
  },
];
