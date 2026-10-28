import { defaultFilter } from '../select';
import { COUNTRY_SHEET_HEIGHT } from './country.constants';
import type { Country } from './country.types';
import { buildCountryOptions, getAllCountries, getCountry, getCountryFlag, getLocalizedName, withSheetHeight } from './country.utils';

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
