import { getCells, sanitizeCode } from './otp.utils';

describe('sanitizeCode', () => {
  it('keeps the digits of a pasted message, up to the length', () => {
    expect(sanitizeCode('Your code is 123-456', 6, 'numeric')).toBe('123456');
    expect(sanitizeCode('1234567', 6, 'numeric')).toBe('123456');
    expect(sanitizeCode('ab', 6, 'numeric')).toBe('');
  });

  it('keeps letters and digits in text mode, as typed', () => {
    expect(sanitizeCode('a1-B2 c3!', 6, 'text')).toBe('a1B2c3');
  });
});

describe('getCells', () => {
  it('focuses the next empty cell and draws the caret there', () => {
    const cells = getCells('12', 4, true, false);
    expect(cells.map((c) => c.char)).toEqual(['1', '2', '', '']);
    expect(cells.map((c) => c.focused)).toEqual([false, false, true, false]);
    expect(cells.map((c) => c.caret)).toEqual([false, false, true, false]);
    expect(cells.map((c) => c.filled)).toEqual([true, true, false, false]);
  });

  it('keeps the last cell focused without a caret once the code is complete', () => {
    const cells = getCells('1234', 4, true, false);
    expect(cells[3]).toMatchObject({ focused: true, caret: false, filled: true });
  });

  it('focuses nothing while the field is blurred, and hides characters when secure', () => {
    const cells = getCells('12', 4, false, true);
    expect(cells.some((c) => c.focused || c.caret)).toBe(false);
    expect(cells.map((c) => c.char)).toEqual(['•', '•', '', '']);
  });
});
