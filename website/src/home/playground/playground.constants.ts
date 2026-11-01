import { BOOKING_FIELD } from '../demo/demo.constants';
import type { Accent, DemoTab, PlaygroundOptions, TabOptions } from './playground.types';

export const DEMO_TAB = {
  date: 'date',
  time: 'time',
  wheel: 'wheel',
  select: 'select',
  emoji: 'emoji',
} as const;

/** The parts of the booking, in order, each with the picker the phone opens for it, for the panel's field chips. */
export const FIELD_TABS = [
  { tab: DEMO_TAB.select, label: BOOKING_FIELD.where },
  { tab: DEMO_TAB.date, label: BOOKING_FIELD.dates },
  { tab: DEMO_TAB.time, label: BOOKING_FIELD.checkIn },
  { tab: DEMO_TAB.wheel, label: BOOKING_FIELD.guests },
  { tab: DEMO_TAB.emoji, label: BOOKING_FIELD.vibe },
];

export const FIELD_LABELS = FIELD_TABS.map((field) => field.label);

export const TAB_COMPONENTS: Record<DemoTab, string> = {
  date: 'DatePicker',
  time: 'TimePicker',
  wheel: 'MultiWheelPicker',
  select: 'SelectList',
  emoji: 'EmojiPicker',
};

export const TAB_DOCS: Record<DemoTab, string> = {
  date: 'components/date-picker',
  time: 'components/time-picker',
  wheel: 'components/multi-wheel-picker',
  select: 'components/select-list',
  emoji: 'components/emoji-picker',
};

/** Each control maps to one real prop, except `prices` and `groups`, which switch the data passed in. */
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
    { key: 'categoryBarPosition', values: ['auto', 'top', 'bottom'] },
  ],
} as const;

export const DEFAULT_OPTIONS: PlaygroundOptions = {
  date: { mode: 'range', prices: true, firstDayOfWeek: 0 },
  time: { format: 'auto', minuteInterval: 15, showSeconds: false },
  wheel: { variant: '3d', loop: false, visibleItems: 5 },
  select: { multiple: false, searchable: true, groups: true, loading: false },
  emoji: { columns: 7, showSkinTones: true, categoryBarPosition: 'auto' },
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
