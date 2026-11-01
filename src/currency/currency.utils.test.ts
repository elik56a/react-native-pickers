import { DEFAULT_PREFERRED_LABEL } from '../select/select.constants';
import { DEFAULT_ALL_CURRENCIES_LABEL, LARGE_AMOUNT_FONT_SIZE, MIN_LARGE_AMOUNT_FONT_SIZE } from './currency.constants';
import {
  buildCurrencyOptions,
  formatAmount,
  getAllCurrencies,
  getAmountPlaceholder,
  getCurrency,
  getLargeAmountFontSize,
  getNumberSeparators,
  getSymbolPosition,
  parseAmountInput,
  resolveCurrency,
} from './currency.utils';

const en = { decimals: 2, separators: getNumberSeparators('en-US'), locale: 'en-US' };
const de = { decimals: 2, separators: getNumberSeparators('de-DE'), locale: 'de-DE' };
const yen = { ...en, decimals: 0 };
const fr = { decimals: 2, separators: getNumberSeparators('fr-FR'), locale: 'fr-FR' };
const ar = { decimals: 2, separators: getNumberSeparators('ar-EG'), locale: 'ar-EG' };

describe('getCurrency', () => {
  it('reads the generated data: name, symbol, decimal places and flag', () => {
    expect(getCurrency('usd')).toEqual({ code: 'USD', name: 'US Dollar', symbol: '$', decimals: 2, country: 'US' });
    expect(getCurrency('JPY')?.decimals).toBe(0);
    expect(getCurrency('KWD')?.decimals).toBe(3);
    expect(getCurrency('EUR')?.country).toBe('EU');
    expect(getCurrency('XOF')?.country).toBeUndefined();
    expect(getCurrency('ZZZ')).toBeUndefined();
  });

  it('lists only money people pay with, not fund codes', () => {
    const codes = getAllCurrencies().map((c) => c.code);
    expect(codes).toContain('ILS');
    expect(codes).not.toContain('USN');
  });

  it('falls back to US dollars for a code the list lacks', () => {
    expect(resolveCurrency('ZZZ').code).toBe('USD');
  });
});

describe('buildCurrencyOptions', () => {
  it('pins the preferred currencies under their header and sorts the rest by name', () => {
    const options = buildCurrencyOptions({ currencies: ['JPY', 'EUR', 'USD', 'CHF'], preferred: ['USD'], locale: 'en' });
    expect(options.map((o) => o.value)).toEqual(['USD', 'EUR', 'JPY', 'CHF']);
    expect(options[0]?.group).toBe(DEFAULT_PREFERRED_LABEL);
    expect(options[1]?.group).toBe(DEFAULT_ALL_CURRENCIES_LABEL);
  });

  it('describes each with its code and symbol, and finds it by either', () => {
    const [chf, usd] = buildCurrencyOptions({ currencies: ['USD', 'CHF'], locale: 'en' });
    expect(usd).toMatchObject({ label: 'US Dollar', description: 'USD · $' });
    expect(chf).toMatchObject({ label: 'Swiss Franc', description: 'CHF' });
    expect(usd?.keywords).toEqual(expect.arrayContaining(['USD', '$']));
  });

  it('leaves out excluded currencies', () => {
    expect(buildCurrencyOptions({ currencies: ['USD', 'EUR'], exclude: ['EUR'] }).map((o) => o.value)).toEqual(['USD']);
  });
});

describe('getNumberSeparators and getSymbolPosition', () => {
  it("follow the locale's way of writing numbers and money", () => {
    expect(getNumberSeparators('en-US')).toEqual({ group: ',', decimal: '.' });
    expect(getNumberSeparators('de-DE')).toEqual({ group: '.', decimal: ',' });
    expect(getSymbolPosition('USD', 'en-US')).toBe('before');
    expect(getSymbolPosition('EUR', 'de-DE')).toBe('after');
  });

  it("use the Latin digits' separators in Arabic, as the digits are Latin", () => {
    expect(getNumberSeparators('ar-EG')).toEqual({ group: ',', decimal: '.' });
  });
});

describe('parseAmountInput', () => {
  it('groups the digits as the user types, and keeps a trailing decimal point', () => {
    expect(parseAmountInput('1234', en)).toEqual({ text: '1,234', value: 1234 });
    expect(parseAmountInput('1,234.', en)).toEqual({ text: '1,234.', value: 1234 });
    expect(parseAmountInput('1,234.5', en)).toEqual({ text: '1,234.5', value: 1234.5 });
    expect(parseAmountInput('1234567', { ...en, locale: 'en-IN' }).text).toBe('12,34,567');
  });

  it("reads the locale's separators", () => {
    expect(parseAmountInput('1.234,56', de)).toEqual({ text: '1.234,56', value: 1234.56 });
  });

  it('drops digits past the decimal places, and a decimal point the currency has none of', () => {
    expect(parseAmountInput('12.345', en)).toEqual({ text: '12.34', value: 12.34 });
    expect(parseAmountInput('12.3', yen)).toEqual({ text: '12', value: 12 });
  });

  it('reads a pasted amount, drops leading zeros and starts a lone point at zero', () => {
    expect(parseAmountInput('$1,234.50', en)).toEqual({ text: '1,234.50', value: 1234.5 });
    expect(parseAmountInput('007', en)).toEqual({ text: '7', value: 7 });
    expect(parseAmountInput('.5', en)).toEqual({ text: '0.5', value: 0.5 });
  });

  it('reads Arabic-Indic and Persian digits', () => {
    expect(parseAmountInput('١٢٣٤٫٥', ar)).toEqual({ text: '1,234.5', value: 1234.5 });
    expect(parseAmountInput('۱۲۳', en)).toEqual({ text: '123', value: 123 });
  });

  it("reads the device's decimal key in another locale's field", () => {
    expect(parseAmountInput('12.', de)).toEqual({ text: '12,', value: 12 });
    expect(parseAmountInput('1.234.', de)).toEqual({ text: '1.234,', value: 1234 });
    expect(parseAmountInput('12,', en)).toEqual({ text: '12.', value: 12 });
    expect(parseAmountInput('12.5', fr)).toEqual({ text: '12,5', value: 12.5 });
    expect(parseAmountInput('1.234,5', de)).toEqual({ text: '1.234,5', value: 1234.5 });
  });

  it('is empty, with no amount, once nothing is left', () => {
    expect(parseAmountInput('', en)).toEqual({ text: '', value: null });
    expect(parseAmountInput('abc', en)).toEqual({ text: '', value: null });
  });
});

describe('formatAmount', () => {
  it('shows whole amounts bare and others with every decimal place', () => {
    expect(formatAmount(1234, en)).toBe('1,234');
    expect(formatAmount(1234.5, en)).toBe('1,234.50');
    expect(formatAmount(1234.5, de)).toBe('1.234,50');
    expect(formatAmount(-3.5, en)).toBe('-3.50');
    expect(formatAmount(null, en)).toBe('');
  });
});

describe('getAmountPlaceholder', () => {
  it('is zero with each decimal place of the currency', () => {
    expect(getAmountPlaceholder(en)).toBe('0.00');
    expect(getAmountPlaceholder(de)).toBe('0,00');
    expect(getAmountPlaceholder(yen)).toBe('0');
  });
});

describe('getLargeAmountFontSize', () => {
  it('stays full size for a short amount and shrinks a long one down to a floor', () => {
    expect(getLargeAmountFontSize(3)).toBe(LARGE_AMOUNT_FONT_SIZE);
    expect(getLargeAmountFontSize(14)).toBe(LARGE_AMOUNT_FONT_SIZE / 2);
    expect(getLargeAmountFontSize(100)).toBe(MIN_LARGE_AMOUNT_FONT_SIZE);
  });
});
