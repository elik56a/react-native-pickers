import type { AnatomyExample, CompareRow, Support } from './home.types';

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
  'Every picker your React Native app needs: date, time, select, country, emoji and more, plus bottom sheets. Native on iOS, Android and web, zero native code.';

const SITE_URL = 'https://react-native-pickers.dev';

/** What a visitor pastes into their AI assistant. */
export const AGENT_PROMPT = `Use ${PACKAGE} for every picker in this React Native app. Before writing code, read ${SITE_URL}/llms-full.txt: it has the whole API.`;

const CONTEXT7_URL = 'https://context7.com/elik56a/react-native-pickers';

export const AGENT_LINKS = [
  { label: 'llms.txt', href: 'pathname:///llms.txt', body: 'An index of every page.' },
  { label: 'llms-full.txt', href: 'pathname:///llms-full.txt', body: 'The whole API, in one file.' },
  { label: 'Context7', href: CONTEXT7_URL, body: 'The same docs, by question.' },
];

/** How far the home page scrolls, in px, before the navbar slides in. */
export const NAV_SHOW_SCROLL = 40;

export const COUNT_UP_MS = 1400;
export const COPIED_MS = 1500;
export const REVEAL_STEP_MS = 90;

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export const ANATOMY_SIDE = {
  left: 'left',
  right: 'right',
} as const;

/**
 * The screens the annotated device takes apart, in turn: each a hero screen, with callouts at the height (%) of the part they point at.
 * Between them they cover every feature: design, locale, selection, theme, accessibility, motion, styles and no native code.
 */
export const ANATOMY_EXAMPLES: AnatomyExample[] = [
  {
    word: 'date',
    callouts: [
      { side: 'left', y: 5, title: 'Design', body: 'Round ends on iOS and in Material, square ones on the web, from one code path.' },
      { side: 'left', y: 25, title: 'Locale', body: 'Month and weekday names from Intl. RTL layouts mirror.' },
      { side: 'left', y: 40, title: 'Selection', body: 'Single, range or multiple, with presets and disabled days.' },
      { side: 'right', y: 25, title: 'Accessibility', body: 'Every day labelled for VoiceOver and TalkBack. Arrow keys on the web.' },
      { side: 'right', y: 40, title: 'Theme', body: 'Your accent and fonts as tokens. Dark mode follows the OS.' },
      { side: 'right', y: 80, title: 'Native code', body: 'None. Pure JavaScript on Animated, so it runs in Expo Go.' },
    ],
  },
  {
    word: 'time',
    callouts: [
      { side: 'left', y: 5, title: 'Design', body: 'Wheels on iOS, a clock dial on Android, columns to click on the web.' },
      { side: 'left', y: 30, title: 'Motion', body: 'The wheels spin on the UI thread, at 60 fps, even while JavaScript is busy.' },
      { side: 'left', y: 46, title: 'Accessibility', body: 'Each wheel is adjustable: swipe up or down with VoiceOver or TalkBack.' },
      { side: 'right', y: 22, title: 'Limits', body: 'Minute intervals, and a min and max time.' },
      { side: 'right', y: 37, title: 'Locale', body: 'AM/PM or 24 hours, from the device locale.' },
      { side: 'right', y: 80, title: 'Styles', body: 'A typed style slot for every part, and render props for the rest.' },
    ],
  },
  {
    word: 'color',
    callouts: [
      {
        side: 'left',
        y: 5,
        title: 'Design',
        body: 'iOS’s tabs, Google’s swatch circles on Android, a spectrum with an eyedropper on the web.',
      },
      { side: 'left', y: 24, title: 'Tabs', body: 'Grid, Spectrum and Sliders, as in iOS.' },
      { side: 'left', y: 48, title: 'Value', body: 'A hex code, with opacity when you want it.' },
      { side: 'left', y: 80, title: 'Native code', body: 'No gradient library: plain views, so it runs in Expo Go.' },
      { side: 'right', y: 24, title: 'Theme', body: 'The picker takes your accent and dark mode too.' },
      { side: 'right', y: 72, title: 'Swatches', body: 'Your colours in a row to scroll, the chosen one large.' },
    ],
  },
  {
    word: 'currency',
    callouts: [
      { side: 'left', y: 5, title: 'Design', body: 'Bold digits on iOS, as in Apple Cash. Regular in Material, as in Google Pay.' },
      { side: 'left', y: 25, title: 'Locale', body: '1,234.50, 1.234,50 € or ₹12,34,567: grouped as you type.' },
      { side: 'right', y: 25, title: 'Value', body: 'A number, in the currency’s own decimal places.' },
      { side: 'right', y: 37, title: 'Currency', body: 'A button opens every currency, with flags, codes and symbols.' },
      { side: 'right', y: 80, title: 'Native code', body: 'No masking library, nothing to link.' },
    ],
  },
  {
    word: 'emoji',
    callouts: [
      {
        side: 'left',
        y: 5,
        title: 'Design',
        body: 'Categories at the bottom on iOS, a tinted pill in Material, underlined tabs on the web.',
      },
      { side: 'left', y: 22, title: 'Search', body: 'By name and keyword, as you type.' },
      { side: 'left', y: 50, title: 'Emojis', body: '1,923 of them, from the system font: no images to bundle.' },
      { side: 'right', y: 22, title: 'Skin tones', body: 'Pick one, and every hand and person follows.' },
      { side: 'right', y: 50, title: 'Versions', body: 'Filter by Emoji version, to what your users’ phones can draw.' },
      { side: 'right', y: 92, title: 'Categories', body: 'Jump to any group, or scroll through them all.' },
    ],
  },
];

/** The carousel's track: every screen, then the first again, for the loop to slide on to before it jumps back (useAnatomyCycle). */
export const ANATOMY_SLIDES = [
  ...ANATOMY_EXAMPLES.map((example) => ({
    key: example.word,
    word: example.word,
  })),
  {
    key: 'loop',
    word: ANATOMY_EXAMPLES[0].word,
  },
];

/** How long each screen stays on the annotated device before the next, and how long the slide to it takes (Anatomy.module.css). */
export const ANATOMY_CYCLE_MS = 6000;
export const ANATOMY_SLIDE_MS = 800;

/** The catalog by job; the building blocks are the parts the others are made of, for pickers of your own. */
export const COMPONENT_GROUPS = [
  {
    title: 'Date & time',
    items: [
      { doc: 'components/time-picker', name: 'TimePicker', body: 'Wheels, clock dial or columns, 12/24h' },
      { doc: 'components/time-range-picker', name: 'Time range', body: 'Opening hours, shifts, overnight' },
      { doc: 'components/duration-picker', name: 'DurationPicker', body: 'Timers and workouts: hours, minutes, seconds' },
      { doc: 'components/date-picker', name: 'DatePicker', body: 'Calendar or wheel, marked dates, i18n' },
      { doc: 'components/date-range-picker', name: 'Date range', body: 'Check-in/out, presets, min/max nights, multiple' },
      { doc: 'components/date-time-picker', name: 'DateTimePicker', body: 'Day + time wheels, or calendar + time' },
      { doc: 'components/month-picker', name: 'MonthPicker', body: 'Card expiry, reports: wheels or a month grid' },
      { doc: 'components/week-strip', name: 'WeekStrip', body: 'A week of days to swipe, with marked days' },
      { doc: 'components/expandable-calendar', name: 'ExpandableCalendar', body: 'A week that opens into its month' },
    ],
  },
  {
    title: 'Select & search',
    items: [
      { doc: 'components/select-picker', name: 'SelectPicker', body: 'Search, server search, groups, multi-select' },
      { doc: 'components/select-list', name: 'SelectList', body: 'The searchable list, inline' },
      { doc: 'components/country-picker', name: 'CountryPicker', body: 'Flags, dialing codes, localized names' },
      { doc: 'components/language-picker', name: 'LanguagePicker', body: 'Flags, each language in itself, for the app language' },
      { doc: 'components/time-zone-picker', name: 'TimeZonePicker', body: 'Every time zone with its GMT offset' },
      { doc: 'components/currency-picker', name: 'CurrencyPicker', body: 'Currencies with flags, codes and symbols' },
      { doc: 'components/horizontal-list', name: 'HorizontalList', body: 'Segmented control or scrolling chips, with icons' },
    ],
  },
  {
    title: 'Input',
    items: [
      { doc: 'components/phone-field', name: 'PhoneField', body: 'Country code and number, formatted as you type' },
      { doc: 'components/amount-field', name: 'AmountField', body: 'Money input, grouped as you type, or large' },
      { doc: 'components/otp-field', name: 'OtpField', body: 'Verification codes, SMS autofill, paste' },
      { doc: 'components/slider', name: 'Slider', body: 'One value or a range, with steps and icons' },
      { doc: 'components/rating', name: 'Rating', body: 'Stars to tap or drag, half steps, scores' },
      { doc: 'components/emoji-picker', name: 'EmojiPicker', body: '1,923 emojis, skin tones, recents, search' },
      { doc: 'components/color-picker', name: 'ColorPicker', body: "iOS's grid, Google's circles, a web spectrum" },
    ],
  },
  {
    title: 'Building blocks',
    items: [
      { doc: 'components/wheel-picker', name: 'WheelPicker', body: '3D wheel, loop, disabled rows, tap-to-type' },
      { doc: 'components/multi-wheel-picker', name: 'MultiWheelPicker', body: 'Units, compound values, dependent columns' },
      { doc: 'components/picker-fields', name: 'Fields', body: 'Tap a field, pick in a sheet, a dropdown or inline' },
      { doc: 'components/picker-sheets', name: 'Sheets', body: 'Every picker in a bottom sheet or modal' },
      { doc: 'components/action-sheet', name: 'ActionSheet', body: 'Share, edit, delete: iOS cards or Material rows' },
      { doc: 'components/menu', name: 'Menu', body: 'Dropdown and long-press menus, pure JS' },
    ],
  },
];

export const COMPONENTS = COMPONENT_GROUPS.flatMap((group) => group.items);

export const STATS = [
  { value: COMPONENTS.length, label: 'components' },
  { value: 0, label: 'native modules' },
  { value: 100, suffix: '%', label: 'TypeScript' },
];

/** What a typical app swaps out: the libraries in the comparison, for one package. */
export const PACKAGE_DIFF = ` "dependencies": {
-  "@react-native-community/datetimepicker": "…",
-  "@react-native-picker/picker": "…",
-  "react-native-calendars": "…",
-  "react-native-picker-select": "…",
+  "${PACKAGE}": "latest",
   "react": "…",
   "react-native": "…"
 }`;

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
