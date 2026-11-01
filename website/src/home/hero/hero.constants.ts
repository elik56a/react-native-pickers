import type { CurrencyCode, LanguageCode } from '@elik56a/react-native-pickers';
import { PLATFORM } from '../device/device.constants';
import type { HeroWordSpec } from './hero.types';

export const HERO_WORD = {
  time: 'time',
  range: 'range',
  date: 'date',
  month: 'month',
  duration: 'duration',
  color: 'color',
  currency: 'currency',
  language: 'language',
  emoji: 'emoji',
} as const;

/**
 * What the headline wheel can pick, and what each looks like on the three devices: the screen it sits on, the line of code behind it
 * and the platform pattern each design follows (from guides/designs.mdx).
 */
export const HERO_WORDS: HeroWordSpec[] = [
  {
    word: HERO_WORD.time,
    title: 'Alarm',
    subtitle: 'Weekdays',
    tag: 'TimePicker',
    props: 'value={time} onChange={setTime}',
    patterns: { ios: 'wheels, like the Clock app', android: 'Material 3 clock dial', web: 'columns of hours to click' },
  },
  {
    word: HERO_WORD.range,
    title: 'Opening hours',
    subtitle: 'Casa do Mar · weekdays',
    tag: 'TimeRangePicker',
    props: 'value={hours} onChange={setHours}',
    patterns: { ios: 'Start/End rows over wheels', android: 'two time boxes, then a dial', web: 'two cards, then columns' },
  },
  {
    word: HERO_WORD.date,
    title: 'Your stay',
    subtitle: 'Casa do Mar · Lisbon',
    tag: 'DatePicker',
    props: 'mode="range" value={stay} onChange={setStay}',
    patterns: { ios: 'like the iOS Calendar app', android: 'Material 3, today ringed', web: 'like Google Calendar on the web' },
  },
  {
    word: HERO_WORD.month,
    title: 'Card expiry',
    subtitle: 'As printed on the card',
    tag: 'MonthPicker',
    props: 'value={month} onChange={setMonth}',
    patterns: { ios: 'month and year wheels', android: 'year, then a month grid', web: 'year, then a month grid' },
  },
  {
    word: HERO_WORD.duration,
    title: 'Timer',
    subtitle: 'Interval run',
    tag: 'DurationPicker',
    props: 'value={seconds} onChange={setSeconds}',
    patterns: { ios: 'wheels with units', android: 'number boxes to type into', web: 'columns to click' },
  },
  {
    word: HERO_WORD.color,
    title: 'Accent',
    subtitle: 'Your theme colour',
    tag: 'ColorPicker',
    props: 'value={color} onChange={setColor}',
    patterns: { ios: 'Grid, Spectrum, Sliders', android: 'swatch circles, then Custom', web: 'spectrum, eyedropper and hex' },
  },
  {
    word: HERO_WORD.currency,
    title: 'Send to Maya',
    subtitle: '@maya · Lisbon',
    tag: 'AmountField',
    props: 'variant="large" value={amount} onChange={setAmount}',
    patterns: { ios: 'bold, like Apple Cash', android: 'regular, like Google Pay', web: 'medium digits' },
  },
  {
    word: HERO_WORD.language,
    title: 'Language',
    subtitle: 'For the whole app',
    tag: 'SelectList',
    props: 'options={languages} value={language} onChange={setLanguage}',
    patterns: { ios: '✓ beside it, the row tinted', android: 'a radio on every row', web: 'compact rows, ✓ beside it' },
  },
  {
    word: HERO_WORD.emoji,
    title: 'React',
    subtitle: 'To Maya’s message',
    tag: 'EmojiPicker',
    props: 'onSelect={setEmoji}',
    patterns: { ios: 'categories at the bottom', android: 'categories in a tinted pill', web: 'categories on top, underlined' },
  },
];

export const HERO_WHEEL_ITEMS = HERO_WORDS.map((spec) => spec.word);

/** The order the devices stand in: the browser, the widest, in the middle. */
export const HERO_PLATFORMS = [PLATFORM.ios, PLATFORM.web, PLATFORM.android];

/** How long each word stays before the wheel turns on its own, until the visitor touches the hero. */
export const HERO_SPIN_MS = 3800;

/** While the wheel turns on its own, the devices wait for it to land before they change, so the two never animate at once. */
export const HERO_SWAP_DELAY_MS = 520;

/** The devices change one after another, left to right, rather than all mounting in one frame. */
export const HERO_STAGGER_MS = 90;

/** A mouse-wheel notch turns the headline wheel one word: this much scroll is a notch, and the next one waits for the turn to land. */
export const HERO_SCROLL_STEP_DELTA = 30;
export const HERO_SCROLL_STEP_MS = 280;
/** Pixels per line, for a wheel event that scrolls by lines (Firefox's mouse wheel) */
export const HERO_SCROLL_LINE_HEIGHT = 16;

/** The three devices fit side by side from this width; below it, one device with the platform rail. */
export const HERO_WIDE_QUERY = '(min-width: 1100px)';
/** Phones, where the headline stacks one word per line, centered, wheel included (Hero.module.css). */
export const HERO_STACKED_QUERY = '(max-width: 640px)';

/** The headline's letter spacing (Hero.module.css), per pixel of font size, so a word on the wheel is as wide as its copy in the band. */
export const HERO_LETTER_SPACING = -0.04;

/** The headline wheel, sized with the headline (Hero.module.css). Narrow screens show the selected row only, so the headline can wrap. */
export const HERO_WHEEL_SIZE = {
  wide: { fontSize: 72, itemHeight: 80, visibleItems: 3 },
  narrow: { fontSize: 40, itemHeight: 48, visibleItems: 1 },
};

/** The headline's faded ink for the words around the selected one, and its accent (--ifm-color-primary), since the wheel's text is styled from JS. */
export const HERO_WHEEL_COLORS = {
  light: { faint: 'rgba(23, 21, 15, 0.35)', accent: '#c8460d' },
  dark: { faint: 'rgba(245, 242, 236, 0.3)', accent: '#ff7a3d' },
};

/** Degrees the stage leans toward the pointer at the hero's edge. */
export const HERO_MAX_TILT = 3;

export const HERO_START = {
  /** The alarm, and when the opening hours start */
  hours: 11,
  minutes: 55,
  /** When the opening hours end */
  closes: 17,
  /** The stay: check-in this many days from now, for this many nights */
  checkIn: 7,
  nights: 3,
  language: 'en' as LanguageCode,
  duration: 25 * 60,
  color: '#C8460D',
  amount: 48,
  currency: 'EUR' as CurrencyCode,
  emoji: '🔥',
};

/** The emoji grid's height: the screen, less the status bar and the screen's title. */
export const HERO_EMOJI_CHROME = 176;
export const HERO_MIN_EMOJI_HEIGHT = 220;

/** The languages in the list, each shown in itself. */
export const HERO_LANGUAGES: LanguageCode[] = ['en', 'es', 'fr', 'de', 'pt-PT', 'he', 'ja', 'ar'];
