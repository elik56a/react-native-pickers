import { HERO_SCROLL_LINE_HEIGHT, HERO_SCROLL_STEP_DELTA, HERO_START, HERO_WORD, HERO_WORDS } from './hero.constants';
import type { HeroValues, HeroWord, HeroWordSpec } from './hero.types';

export const getWordSpec = (word: HeroWord): HeroWordSpec => HERO_WORDS.find((spec) => spec.word === word) ?? HERO_WORDS[0];

/** The word `step` rows from `word` on the looping wheel: 1 is the next, -1 the previous. */
export const stepWord = (word: HeroWord, step: number): HeroWord => {
  const count = HERO_WORDS.length;
  const index = HERO_WORDS.findIndex((spec) => spec.word === word);
  return HERO_WORDS[(((index + step) % count) + count) % count].word;
};

export const nextWord = (word: HeroWord) => stepWord(word, 1);

/** Dates are from `now`: the alarm today, a three-night stay from a week on, the card expiring in three years. */
export const getInitialHeroValues = (now: Date): HeroValues => {
  const time = new Date(now);
  time.setHours(HERO_START.hours, HERO_START.minutes, 0, 0);
  const day = (offset: number) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
  const closes = new Date(now.getFullYear(), now.getMonth(), now.getDate(), HERO_START.closes);
  return {
    time,
    range: {
      start: new Date(time),
      end: closes,
    },
    date: {
      start: day(HERO_START.checkIn),
      end: day(HERO_START.checkIn + HERO_START.nights),
    },
    month: new Date(now.getFullYear() + 3, now.getMonth(), 1),
    duration: HERO_START.duration,
    color: HERO_START.color,
    amount: HERO_START.amount,
    currency: HERO_START.currency,
    language: HERO_START.language,
    emoji: HERO_START.emoji,
  };
};

const pad = (n: number) => String(n).padStart(2, '0');

const clock = (date: Date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`;

const shortDay = (date: Date | null) => date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) ?? '…';

/** The value the three devices share, as the code line under them prints it. */
export const formatHeroValue = (word: HeroWord, values: HeroValues): string => {
  switch (word) {
    case HERO_WORD.time:
      return clock(values.time);
    case HERO_WORD.range:
      return `${clock(values.range.start)}–${clock(values.range.end)}`;
    case HERO_WORD.date:
      return `${shortDay(values.date.start)} – ${shortDay(values.date.end)}`;
    case HERO_WORD.month:
      return values.month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    case HERO_WORD.duration: {
      const hours = Math.floor(values.duration / 3600);
      const rest = `${pad(Math.floor((values.duration % 3600) / 60))}:${pad(values.duration % 60)}`;
      return hours ? `${hours}:${rest}` : rest;
    }
    case HERO_WORD.color:
      return values.color;
    case HERO_WORD.language:
      return values.language;
    case HERO_WORD.currency:
      return values.amount === null ? `0 ${values.currency}` : `${values.amount} ${values.currency}`;
    default:
      return values.emoji;
  }
};

/** A picker's height that fills the screen around its `chrome`, never shorter than `min`. */
export const fillHeight = (screenHeight: number | undefined, chrome: number, min: number) => Math.max(min, (screenHeight ?? 0) - chrome);

/** The word a scroll of `delta` pixels turns to: none until it adds up to a notch, then one, whichever way it went. */
export const scrollStep = (delta: number) => (Math.abs(delta) < HERO_SCROLL_STEP_DELTA ? 0 : Math.sign(delta));

/** A wheel event's vertical scroll in pixels, whether it scrolls by pixels or by lines. */
export const scrollPixels = ({ deltaY, deltaMode }: Pick<WheelEvent, 'deltaY' | 'deltaMode'>) =>
  deltaMode === 1 ? deltaY * HERO_SCROLL_LINE_HEIGHT : deltaY;
