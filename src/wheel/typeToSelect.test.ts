import { canExtend, matchLabel } from './typeToSelect';

const labels = (...l: string[]) => l.map((label) => ({ label }));
const minutes = labels('00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55');
const sizes = labels('XS', 'S', 'M', 'L', 'XL', 'XXL');

describe('typeToSelect', () => {
  test('numeric wheels match by value, so "5" finds padded "05"', () => {
    expect(matchLabel(minutes, '5', true)).toBe(1);
    expect(matchLabel(minutes, '55', true)).toBe(11);
    expect(matchLabel(minutes, '7', true)).toBe(-1);
  });
  test('text wheels match case-insensitive prefixes', () => {
    expect(matchLabel(sizes, 'x', false)).toBe(0);
    expect(matchLabel(sizes, 'xx', false)).toBe(5);
    expect(matchLabel(sizes, 'q', false)).toBe(-1);
  });
  test('disabled items are skipped', () => {
    expect(matchLabel([{ label: 'XS', disabled: true }, { label: 'XL' }], 'x', false)).toBe(1);
  });
  test('canExtend tells whether more typing could pick a longer label', () => {
    expect(canExtend(minutes, '5')).toBe(true);
    expect(canExtend(minutes, '05')).toBe(false);
    expect(canExtend(sizes, 'x')).toBe(true);
    expect(canExtend(sizes, 'm')).toBe(false);
  });
});
