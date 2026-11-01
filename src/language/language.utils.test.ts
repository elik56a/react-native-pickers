import type { Language } from './language.types';
import { buildLanguageOptions, getAllLanguages, getLanguage, getLanguageName, isRtlLanguage } from './language.utils';

describe('language data', () => {
  it('has a unique tag, an English name and a native name for every language', () => {
    const all = getAllLanguages();
    expect(new Set(all.map((l) => l.code)).size).toBe(all.length);
    expect(all.every((l) => l.name && l.nativeName)).toBe(true);
  });

  it('looks languages up in any case', () => {
    expect(getLanguage('pt-br')?.nativeName).toBe('Português (Brasil)');
    expect(getLanguage('xx')).toBeUndefined();
  });
});

describe('isRtlLanguage', () => {
  it('reads the base language of any tag', () => {
    expect(isRtlLanguage('he')).toBe(true);
    expect(isRtlLanguage('ar-EG')).toBe(true);
    expect(isRtlLanguage('fa_IR')).toBe(true);
    expect(isRtlLanguage('en-US')).toBe(false);
    expect(isRtlLanguage('xx')).toBe(false);
  });
});

describe('getLanguageName', () => {
  const german = getLanguage('de') as Language;

  it('names the language in the locale', () => {
    expect(getLanguageName(german, 'fr')).toBe('allemand');
  });

  it('falls back to English without Intl.DisplayNames', () => {
    const spy = jest.spyOn(Intl, 'DisplayNames').mockImplementation(() => {
      throw new TypeError('Intl.DisplayNames is not a constructor');
    });
    expect(getLanguageName(german, 'ja')).toBe('German');
    spy.mockRestore();
  });
});

describe('buildLanguageOptions', () => {
  it('labels each language in itself, with its name in the locale below, sorted by that name', () => {
    const options = buildLanguageOptions({ languages: ['es', 'de', 'en'], locale: 'en' });
    expect(options.map((o) => [o.label, o.description])).toEqual([
      ['English', undefined],
      ['Deutsch', 'German'],
      ['Español', 'Spanish'],
    ]);
  });

  it('puts preferred languages first under their header, leaves out excluded ones, and searches by tag and name', () => {
    const options = buildLanguageOptions({ languages: ['es', 'de', 'he'], exclude: ['de'], preferred: ['he'], locale: 'en' });
    expect(options.map((o) => [o.value, o.group])).toEqual([
      ['he', 'Suggested'],
      ['es', 'All languages'],
    ]);
    expect(options[0]?.keywords).toEqual(expect.arrayContaining(['he', 'Hebrew']));
  });
});
