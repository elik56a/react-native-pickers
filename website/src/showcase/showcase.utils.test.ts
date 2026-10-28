import { CLOSED_WEEKDAY, TIMER_PRESETS } from './showcase.constants';
import { findPreset, formatClock, insertAtSelection, isClosedDay } from './showcase.utils';

describe('formatClock', () => {
  it('reads like a clock, with hours only once there are some', () => {
    expect(formatClock(4 * 60)).toBe('4:00');
    expect(formatClock(65)).toBe('1:05');
    expect(formatClock(2 * 3600 + 15 * 60)).toBe('2:15:00');
  });
});

describe('isClosedDay', () => {
  it('closes on one weekday only', () => {
    const monday = new Date(2026, 9, 26);
    expect(monday.getDay()).toBe(CLOSED_WEEKDAY);
    expect(isClosedDay(monday)).toBe(true);
    expect(isClosedDay(new Date(2026, 9, 27))).toBe(false);
  });
});

describe('findPreset', () => {
  it('matches a preset by its length, and nothing for a custom one', () => {
    expect(findPreset(90)).toBe(TIMER_PRESETS[2]);
    expect(findPreset(91)).toBeUndefined();
  });
});

describe('insertAtSelection', () => {
  it('inserts at the caret, or replaces the selection, and moves the caret after it', () => {
    expect(insertAtSelection('See you', { start: 3, end: 3 }, '🍕')).toEqual({
      text: 'See🍕 you',
      selection: { start: 5, end: 5 },
    });
    expect(insertAtSelection('So good', { start: 3, end: 7 }, '🔥')).toEqual({
      text: 'So 🔥',
      selection: { start: 5, end: 5 },
    });
  });
});
