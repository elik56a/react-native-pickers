import type { Accent, DemoTab, PlaygroundOptions, TabOptions } from './playground.types';

export const DEMO_TAB = {
  date: 'date',
  time: 'time',
  wheel: 'wheel',
  select: 'select',
  emoji: 'emoji',
  country: 'country',
} as const;

/** Shown in the props panel and the live code until the visitor touches a field on the phone. */
export const PICK_A_FIELD = 'Tap a field on the phone to try its picker’s props.';
export const PICK_A_FIELD_CODE = 'Tap a field on the phone to see its code.';

export const TAB_COMPONENTS: Record<DemoTab, string> = {
  date: 'DatePickerField',
  time: 'TimePickerField',
  wheel: 'MultiWheelPicker',
  select: 'SelectPicker',
  emoji: 'EmojiPickerField',
  country: 'CountryPicker',
};

export const TAB_DOCS: Record<DemoTab, string> = {
  date: 'components/date-picker',
  time: 'components/time-picker',
  wheel: 'components/multi-wheel-picker',
  select: 'components/select-picker',
  emoji: 'components/emoji-picker',
  country: 'components/country-picker',
};

/** Each control maps to one real prop, except `prices`, `groups` and `preferred`, which switch the data passed in. */
export const CONTROLS = {
  date: [
    { key: 'mode', values: ['single', 'range', 'multiple', 'ranges'] },
    { key: 'prices', values: [true, false] },
    { key: 'firstDayOfWeek', values: [0, 1], labels: ['Sun', 'Mon'] },
  ],
  time: [
    { key: 'format', values: ['auto', '12h', '24h'] },
    { key: 'minuteInterval', values: [1, 5, 15] },
    { key: 'showSeconds', values: [false, true] },
  ],
  wheel: [
    { key: 'variant', values: ['3d', 'flat'] },
    { key: 'loop', values: [true, false] },
    { key: 'visibleItems', values: [5, 7] },
  ],
  select: [
    { key: 'multiple', values: [true, false] },
    { key: 'searchable', values: [true, false] },
    { key: 'groups', values: [true, false] },
    { key: 'loading', values: [false, true] },
  ],
  emoji: [
    { key: 'columns', values: [6, 7, 8] },
    { key: 'showSkinTones', values: [true, false] },
    { key: 'categoryBarPosition', values: ['top', 'bottom'] },
  ],
  country: [
    { key: 'preferred', values: [true, false] },
    { key: 'showDialCode', values: [false, true] },
    { key: 'locale', values: ['auto', 'de', 'ja'] },
  ],
} as const;

export const DEFAULT_OPTIONS: PlaygroundOptions = {
  date: { mode: 'range', prices: true, firstDayOfWeek: 0 },
  time: { format: 'auto', minuteInterval: 15, showSeconds: false },
  wheel: { variant: '3d', loop: false, visibleItems: 5 },
  select: { multiple: false, searchable: true, groups: true, loading: false },
  emoji: { columns: 7, showSkinTones: true, categoryBarPosition: 'top' },
  country: { preferred: true, showDialCode: false, locale: 'auto' },
};

export const ACCENTS: Accent[] = [
  { key: 'default', label: 'Default theme', swatch: '#C8460D' },
  {
    key: 'blue',
    label: 'Blue',
    swatch: '#2563EB',
    theme: {
      light: { primary: '#2563EB', primaryMuted: 'rgba(37,99,235,0.12)' },
      dark: { primary: '#60A5FA', primaryMuted: 'rgba(96,165,250,0.18)' },
    },
  },
  {
    key: 'green',
    label: 'Green',
    swatch: '#059669',
    theme: {
      light: { primary: '#059669', primaryMuted: 'rgba(5,150,105,0.12)' },
      dark: { primary: '#34D399', primaryMuted: 'rgba(52,211,153,0.18)' },
    },
  },
  {
    key: 'violet',
    label: 'Violet',
    swatch: '#7C3AED',
    theme: {
      light: { primary: '#7C3AED', primaryMuted: 'rgba(124,58,237,0.12)' },
      dark: { primary: '#A78BFA', primaryMuted: 'rgba(167,139,250,0.18)' },
    },
  },
  {
    key: 'pink',
    label: 'Pink',
    swatch: '#DB2777',
    theme: {
      light: { primary: '#DB2777', primaryMuted: 'rgba(219,39,119,0.12)' },
      dark: { primary: '#F472B6', primaryMuted: 'rgba(244,114,182,0.18)' },
    },
  },
];

/** The state names the date snippet uses for each mode. */
export const DATE_STATE: Record<TabOptions<'date'>['mode'], [string, string]> = {
  single: ['date', 'setDate'],
  range: ['range', 'setRange'],
  multiple: ['dates', 'setDates'],
  ranges: ['ranges', 'setRanges'],
};
