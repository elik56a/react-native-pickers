import { defaultFilter } from '../select';
import { COUNTRY_SHEET_HEIGHT } from './country.constants';
import type { Country } from './country.types';
import {
  buildCountryOptions,
  formatNationalNumber,
  getAllCountries,
  getCallingCode,
  getCountry,
  getCountryFlag,
  getLocalizedName,
  getPhonePlaceholder,
  isValidPhone,
  parsePhone,
  toE164,
  toNationalNumber,
  withSheetHeight,
} from './country.utils';

const labels = (options: { label: string }[]) => options.map((o) => o.label);

describe('country data', () => {
  it('parses every country with a unique code, a dialing code and a flag', () => {
    const all = getAllCountries();
    expect(all.length).toBeGreaterThan(240);
    expect(new Set(all.map((c) => c.code)).size).toBe(all.length);
    expect(all.every((c) => /^\+\d/.test(c.dialCode))).toBe(true);
    expect(all.every((c) => Array.from(c.flag).length === 2)).toBe(true);
  });

  it('looks a country up by code, in any case', () => {
    expect(getCountry('il')).toEqual({
      code: 'IL',
      name: 'Israel',
      nativeName: 'יִשְׂרָאֵל',
      dialCode: '+972',
      flag: '🇮🇱',
      keywords: [],
    });
    expect(getCountry('ZZ')).toBeUndefined();
  });

  it('keeps aliases and extra dialing codes as keywords', () => {
    expect(getCountry('US')?.keywords).toContain('USA');
    expect(getCountry('DO')).toMatchObject({ dialCode: '+1 809', keywords: ['+1 829', '+1 849'] });
    expect(getCountry('XK')?.dialCode).toBe('+383');
  });

  it('builds flags from ISO codes', () => {
    expect(getCountryFlag('jp')).toBe('🇯🇵');
  });
});

describe('getLocalizedName', () => {
  const germany = getCountry('DE') as Country;

  it('names the country in the locale', () => {
    expect(getLocalizedName(germany, 'de')).toBe('Deutschland');
  });

  it('falls back to English without Intl.DisplayNames', () => {
    const spy = jest.spyOn(Intl, 'DisplayNames').mockImplementation(() => {
      throw new TypeError('Intl.DisplayNames is not a constructor');
    });
    expect(getLocalizedName(germany, 'fr')).toBe('Germany');
    spy.mockRestore();
  });
});

describe('buildCountryOptions', () => {
  it('sorts by localized name', () => {
    const options = buildCountryOptions({ countries: ['DE', 'AT', 'ES'], locale: 'de' });
    expect(labels(options)).toEqual(['Deutschland', 'Österreich', 'Spanien']);
  });

  it('keeps only `countries`, minus `exclude`', () => {
    expect(buildCountryOptions({ countries: ['IL', 'US', 'ZZ' as 'US'], exclude: ['US'], locale: 'en' })).toHaveLength(1);
    expect(buildCountryOptions({ exclude: ['IL'] }).some((o) => o.value === 'IL')).toBe(false);
  });

  it('pins `preferred` first under its header, without repeating them', () => {
    const options = buildCountryOptions({ countries: ['FR', 'IL', 'US'], preferred: ['US', 'IL'], locale: 'en' });
    expect(options.map((o) => [o.value, o.group])).toEqual([
      ['US', 'Suggested'],
      ['IL', 'Suggested'],
      ['FR', 'All countries'],
    ]);
  });

  it('adds no headers without `preferred`', () => {
    expect(buildCountryOptions({ countries: ['FR', 'IL'] }).every((o) => o.group === undefined)).toBe(true);
  });

  it('shows the dialing code only when asked', () => {
    expect(buildCountryOptions({ countries: ['IL'] })[0]?.description).toBeUndefined();
    expect(buildCountryOptions({ countries: ['IL'], showDialCode: true })[0]?.description).toBe('+972');
  });

  it('searches English and native names, aliases, codes and dialing codes in any locale', () => {
    const options = buildCountryOptions({ locale: 'he' });
    const find = (query: string) => options.filter((o) => defaultFilter(o, query)).map((o) => o.value);
    expect(find('germany')).toEqual(['DE']);
    expect(find('deutschland')).toEqual(['DE']);
    expect(find('usa')).toContain('US');
    expect(find('+972')).toEqual(['IL']);
    expect(find('jp')).toContain('JP');
  });
});

describe('withSheetHeight', () => {
  it('opens at a fixed height unless the sheet sets its own', () => {
    expect(withSheetHeight(undefined)?.sheetProps?.height).toBe(COUNTRY_SHEET_HEIGHT);
    expect(withSheetHeight({ sheetProps: { height: 0.5 } })?.sheetProps?.height).toBe(0.5);
  });
});

describe('phone numbers', () => {
  it('groups digits as the country writes them, adding a separator only once a digit follows', () => {
    expect(formatNationalNumber('2015550123', 'US')).toBe('(201) 555-0123');
    expect(formatNationalNumber('201', 'US')).toBe('(201');
    expect(formatNationalNumber('541234567', 'IL')).toBe('54-123-4567');
    expect(formatNationalNumber('612345678', 'FR')).toBe('6 12 34 56 78');
  });

  it('uses the main country’s pattern for islands sharing its calling code, and groups of three elsewhere', () => {
    expect(getCallingCode('JM')).toBe('1');
    expect(formatNationalNumber('8765551234', 'JM')).toBe('(876) 555-1234');
    expect(formatNationalNumber('1234567', 'IS')).toBe('123 456 7');
  });

  it('drops a trunk 0 and separators, keeps Italy’s 0, and stops at the longest number', () => {
    expect(toNationalNumber('054-123-4567', 'IL')).toBe('541234567');
    expect(toNationalNumber('06 1234 5678', 'IT')).toBe('0612345678');
    expect(toNationalNumber('2015550123999', 'US')).toBe('2015550123');
  });

  it('writes E.164 and checks the length', () => {
    expect(toE164('541234567', 'IL')).toBe('+972541234567');
    expect(toE164('', 'IL')).toBe('');
    expect(isValidPhone('541234567', 'IL')).toBe(true);
    expect(isValidPhone('5412', 'IL')).toBe(false);
    expect(isValidPhone('12345', 'IS')).toBe(true);
  });

  it('finds the country of an international number, keeping the current one when its code matches', () => {
    expect(parsePhone('+972 54-123-4567')).toEqual({ country: 'IL', nationalNumber: '541234567' });
    expect(parsePhone('+12015550123')).toEqual({ country: 'US', nationalNumber: '2015550123' });
    expect(parsePhone('+18765551234')).toEqual({ country: 'JM', nationalNumber: '8765551234' });
    expect(parsePhone('+18765551234', 'US')).toEqual({ country: 'US', nationalNumber: '8765551234' });
    expect(parsePhone('+16135550123', 'CA')).toEqual({ country: 'CA', nationalNumber: '6135550123' });
    expect(parsePhone('+999')).toEqual({ nationalNumber: '999' });
  });

  it('shows an example in the country’s format as the placeholder', () => {
    expect(getPhonePlaceholder('US')).toBe('(123) 456-7890');
  });
});
