import type { CompareRow, Support } from './home.types';

export const PACKAGE = '@elik56a/react-native-pickers';
export const INSTALL = `npm install ${PACKAGE}`;
export const NPM_PACKAGE_URL = `https://www.npmjs.com/package/${PACKAGE}`;
/** npm's own `last-year` period: a dated range gets cached by npm's CDN and can serve a day-old count for hours. */
export const NPM_DOWNLOADS_URL = `https://api.npmjs.org/downloads/point/last-year/${PACKAGE}`;

export const NPM_DOWNLOADS_STATUS = {
  loading: 'loading',
  unavailable: 'unavailable',
} as const;

export const PAGE_TITLE = 'Date, Time, Select & Emoji Pickers with Zero Native Code';
export const PAGE_DESCRIPTION =
  'Wheel, time, duration, date, month, week, range, date-time, select, country, phone, time zone, emoji and color pickers, a slider, a star rating and an OTP code input for React Native, with bottom sheets and form fields. Looks native on iOS, Android and the web, with zero native code. Fully themeable; works in Expo Go, bare RN and React Native Web.';

export const COUNT_UP_MS = 1400;
export const COPIED_MS = 1500;
export const REVEAL_STEP_MS = 90;

export const FEATURES = [
  {
    title: 'Native on every platform',
    body: 'iOS on iPhone, Material Design on Android, a web design in the browser, from one code path. Want one look everywhere? Set design="ios".',
  },
  {
    title: 'Zero native code',
    body: 'Pure JavaScript. Runs in Expo Go, bare React Native and React Native Web with no pod install or rebuild.',
  },
  {
    title: 'Yours to customize',
    body: 'Design tokens, automatic dark mode, a typed style slot for every part, and render props when you need full control. Your settings always win over the design.',
  },
  {
    title: 'Ranges, built in',
    body: 'Single, range and multiple date selection with min/max nights, disabled days, prices and dots, all with no marking logic to write.',
  },
  {
    title: 'Search anything',
    body: 'Searchable selects and multi-selects, or search your server as the user types, with a loader, debounce and paging.',
  },
  {
    title: 'Any locale, RTL',
    body: 'Month, weekday and AM/PM names, the 12/24h clock, week start and date order all come from Intl. Layouts mirror for RTL.',
  },
  {
    title: 'Accessible',
    body: 'Adjustable wheels for VoiceOver and TalkBack, fully labelled days, arrow keys on the web, and selected and disabled states everywhere.',
  },
  { title: 'Fast', body: 'Native-driver animations, virtualized fixed-layout lists and memoized rows keep it at 60 fps.' },
];

export const COMPONENTS = [
  { doc: 'components/wheel-picker', name: 'WheelPicker', body: '3D wheel, loop, disabled rows, tap-to-type' },
  { doc: 'components/time-picker', name: 'TimePicker', body: 'Wheels, clock dial or columns, 12/24h' },
  { doc: 'components/duration-picker', name: 'DurationPicker', body: 'Timers and workouts: hours, minutes, seconds' },
  { doc: 'components/date-picker', name: 'DatePicker', body: 'Calendar or wheel, marked dates, i18n' },
  { doc: 'components/month-picker', name: 'MonthPicker', body: 'Card expiry, reports: wheels or a month grid' },
  { doc: 'components/week-strip', name: 'WeekStrip', body: 'A week of days to swipe, with marked days' },
  { doc: 'components/date-time-picker', name: 'DateTimePicker', body: 'Day + time wheels, or calendar + time' },
  { doc: 'components/date-range-picker', name: 'Date range', body: 'Check-in/out, min/max nights, multiple' },
  { doc: 'components/select-picker', name: 'SelectPicker', body: 'Search, server search, groups, multi-select' },
  { doc: 'components/select-list', name: 'SelectList', body: 'The searchable list, inline' },
  { doc: 'components/country-picker', name: 'CountryPicker', body: 'Flags, dialing codes, localized names' },
  { doc: 'components/phone-field', name: 'PhoneField', body: 'Country code and number, formatted as you type' },
  { doc: 'components/time-zone-picker', name: 'TimeZonePicker', body: 'Every time zone with its GMT offset' },
  { doc: 'components/horizontal-list', name: 'HorizontalList', body: 'Segmented control or scrolling chips, with icons' },
  { doc: 'components/emoji-picker', name: 'EmojiPicker', body: '1,923 emojis, skin tones, recents, search' },
  { doc: 'components/color-picker', name: 'ColorPicker', body: "iOS's grid, Google's circles, a web spectrum" },
  { doc: 'components/slider', name: 'Slider', body: 'One value or a range, with steps and icons' },
  { doc: 'components/otp-field', name: 'OtpField', body: 'Verification codes, SMS autofill, paste' },
  { doc: 'components/rating', name: 'Rating', body: 'Stars to tap or drag, half steps, scores' },
  { doc: 'components/multi-wheel-picker', name: 'MultiWheelPicker', body: 'Units, compound values, dependent columns' },
  { doc: 'components/picker-sheets', name: 'Sheets', body: 'Every picker in a bottom sheet or modal' },
  { doc: 'components/picker-fields', name: 'Fields', body: 'Tap a field, pick in a sheet, a dropdown or inline' },
];

export const HERO_CHIPS = [
  { icon: '📦', text: 'Zero native code' },
  { icon: '🌙', text: 'Dark mode built in' },
  { icon: '🎨', text: 'iOS, Material & web looks' },
  { icon: '🌍', text: 'Any locale, RTL' },
];

/** The chips pop in after the hero copy, one every other reveal step. */
export const HERO_CHIPS_FIRST_STEP = 6;

export const STATS = [
  { value: COMPONENTS.length, label: 'components' },
  { value: 0, label: 'native modules' },
  { value: 1923, label: 'emojis' },
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
    cells: [{ support: yes, note: 'Local or server' }, { support: no }, { support: no }, { support: partial, note: 'Varies' }],
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
    feature: 'Native look on iOS, Android and web',
    cells: [{ support: yes, note: 'Or one look everywhere' }, { support: yes }, { support: no }, { support: partial, note: 'No web' }],
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
    feature: 'Zero native code',
    cells: [{ support: yes }, { support: no }, { support: yes, note: 'Usually' }, { support: no }],
  },
];
