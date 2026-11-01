import { ALBUM_SORT, ALBUMS, APPLICATION_ERRORS, CLOSED_WEEKDAY, EMPTY_APPLICATION, TIMER_PRESETS } from './showcase.constants';
import type { ApplicationValues } from './showcase.types';
import {
  attentionLabel,
  findPreset,
  formatClock,
  formatHour,
  insertAtSelection,
  isClosedDay,
  previewOpacity,
  sortAlbums,
  textSizeLabel,
  validateApplication,
} from './showcase.utils';

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

describe('formatHour', () => {
  it('reads an hour of the day on a 12-hour clock', () => {
    expect(formatHour(0)).toBe('12 AM');
    expect(formatHour(9)).toBe('9 AM');
    expect(formatHour(12)).toBe('12 PM');
    expect(formatHour(17)).toBe('5 PM');
    expect(formatHour(24)).toBe('12 AM');
  });
});

describe('previewOpacity', () => {
  it('dims with brightness but never fully', () => {
    expect(previewOpacity(100)).toBe(1);
    expect(previewOpacity(0)).toBe(0.3);
    expect(previewOpacity(50)).toBeCloseTo(0.65);
  });
});

describe('textSizeLabel', () => {
  it('names a size by its mark, or in points off the marks', () => {
    expect(textSizeLabel(17)).toBe('M');
    expect(textSizeLabel(16)).toBe('16 pt');
  });
});

describe('sortAlbums', () => {
  it('sorts by name or by photo count, and keeps the list order for recent', () => {
    expect(sortAlbums(ALBUMS, ALBUM_SORT.name)[0].name).toBe('Hiking the Alps');
    expect(sortAlbums(ALBUMS, ALBUM_SORT.photos)[0].photos).toBe(214);
    expect(sortAlbums(ALBUMS, ALBUM_SORT.recent)).toBe(ALBUMS);
  });
});

describe('validateApplication', () => {
  const complete: ApplicationValues = {
    role: 'Mobile engineer',
    country: 'PT',
    phone: '+351912345678',
    phoneValid: true,
    startDate: new Date(2026, 11, 7),
    interview: new Date(2026, 11, 2, 10, 30),
    skills: ['React Native', 'TypeScript'],
  };

  it('has an error for every empty field, and none once all are filled', () => {
    expect(Object.keys(validateApplication(EMPTY_APPLICATION))).toEqual(['role', 'country', 'phone', 'startDate', 'interview', 'skills']);
    expect(validateApplication(complete)).toEqual({});
  });

  it('asks for the full number when the phone is too short', () => {
    expect(validateApplication({ ...complete, phoneValid: false }).phone).toBe(APPLICATION_ERRORS.phoneIncomplete);
  });

  it('needs the interview before the first day, comparing calendar days', () => {
    const sameDay = new Date(2026, 11, 7, 9, 0);
    expect(validateApplication({ ...complete, interview: sameDay }).interview).toBe(APPLICATION_ERRORS.interviewAfterStart);
    expect(validateApplication({ ...complete, startDate: null }).interview).toBeUndefined();
  });

  it('needs the minimum number of skills', () => {
    expect(validateApplication({ ...complete, skills: ['Testing'] }).skills).toBe(APPLICATION_ERRORS.skills);
  });
});

describe('attentionLabel', () => {
  it('agrees with the count', () => {
    expect(attentionLabel(1)).toBe('1 field needs attention');
    expect(attentionLabel(3)).toBe('3 fields need attention');
  });
});
