import { HERO_SCROLL_START, HERO_START, HERO_WORD, HERO_WORDS } from './hero.constants';
import { fillHeight, formatHeroValue, getInitialHeroValues, getWordSpec, nextWord, scrollPixels, scrollTurn, stepWord } from './hero.utils';

describe('nextWord', () => {
  it('goes through every word and back to the first', () => {
    expect(nextWord(HERO_WORD.time)).toBe(HERO_WORD.range);
    expect(nextWord(HERO_WORDS[HERO_WORDS.length - 1].word)).toBe(HERO_WORDS[0].word);
  });
});

describe('stepWord', () => {
  it('turns either way and wraps around', () => {
    expect(stepWord(HERO_WORD.date, -1)).toBe(HERO_WORD.range);
    expect(stepWord(HERO_WORD.time, -1)).toBe(HERO_WORDS[HERO_WORDS.length - 1].word);
    expect(stepWord(HERO_WORD.time, 2)).toBe(HERO_WORD.date);
    expect(stepWord(HERO_WORD.time, HERO_WORDS.length)).toBe(HERO_WORD.time);
  });
});

describe('getWordSpec', () => {
  it('finds the word’s screen and code', () => {
    expect(getWordSpec(HERO_WORD.currency).tag).toBe('AmountField');
  });
});

describe('getInitialHeroValues', () => {
  it('sets the alarm today, and the stay and card ahead of now', () => {
    const now = new Date(2026, 10, 1, 15, 0);
    const values = getInitialHeroValues(now);
    expect(values.time.getHours()).toBe(HERO_START.hours);
    expect(values.time.getDate()).toBe(1);
    expect(values.date).toEqual({
      start: new Date(2026, 10, 8),
      end: new Date(2026, 10, 11),
    });
    expect(values.month).toEqual(new Date(2029, 10, 1));
  });
});

describe('fillHeight', () => {
  it('fills the screen under the title, with a minimum', () => {
    expect(fillHeight(600, 150, 220)).toBe(450);
    expect(fillHeight(300, 150, 220)).toBe(220);
    expect(fillHeight(undefined, 150, 220)).toBe(220);
  });
});

describe('formatHeroValue', () => {
  const values = getInitialHeroValues(new Date(2026, 10, 1, 15, 0));

  it('prints each word’s value', () => {
    expect(formatHeroValue(HERO_WORD.time, values)).toBe('11:55');
    expect(formatHeroValue(HERO_WORD.range, values)).toBe('11:55–17:00');
    expect(formatHeroValue(HERO_WORD.language, values)).toBe('en');
    expect(formatHeroValue(HERO_WORD.date, values)).toBe('Nov 8 – Nov 11');
    expect(formatHeroValue(HERO_WORD.month, values)).toBe('Nov 2029');
    expect(formatHeroValue(HERO_WORD.duration, values)).toBe('25:00');
    expect(formatHeroValue(HERO_WORD.currency, values)).toBe('48 EUR');
    expect(formatHeroValue(HERO_WORD.emoji, values)).toBe('🔥');
  });

  it('shows a stay whose end is not picked yet', () => {
    expect(formatHeroValue(HERO_WORD.date, { ...values, date: { start: new Date(2026, 10, 8), end: null } })).toBe('Nov 8 – …');
  });

  it('adds hours to a long duration, and zero to an empty amount', () => {
    expect(formatHeroValue(HERO_WORD.duration, { ...values, duration: 3725 })).toBe('1:02:05');
    expect(formatHeroValue(HERO_WORD.currency, { ...values, amount: null })).toBe('0 EUR');
  });
});

describe('scrollTurn', () => {
  /** The words a run of `[delta, time]` wheel events turns, in order */
  const turns = (events: [number, number][]) => {
    let scroll = HERO_SCROLL_START;
    return events.map(([delta, time]) => {
      const next = scrollTurn(scroll, delta, time);
      scroll = next.scroll;
      return next.step;
    });
  };

  it('turns one word per notch, however few pixels it reports, either way', () => {
    expect(
      turns([
        [4, 0],
        [4, 400],
        [-100, 800],
      ])
    ).toEqual([1, 1, -1]);
  });

  it('turns once for the events of one notch', () => {
    expect(
      turns([
        [4, 0],
        [6, 16],
        [8, 32],
      ])
    ).toEqual([1, 0, 0]);
  });

  it('keeps turning through a long scroll, at most once per step time', () => {
    const swipe = Array.from({ length: 20 }, (_, i): [number, number] => [30, i * 16]);
    const steps = turns(swipe);
    expect(steps[0]).toBe(1);
    expect(steps.filter(Boolean).length).toBe(2);
  });
});

describe('scrollPixels', () => {
  it('reads line scrolls as pixels', () => {
    expect(scrollPixels({ deltaY: 100, deltaMode: 0 })).toBe(100);
    expect(scrollPixels({ deltaY: 3, deltaMode: 1 })).toBe(48);
  });
});
