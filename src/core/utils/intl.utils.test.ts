import { safe } from './intl.utils';

describe('safe', () => {
  it('returns the result, or the fallback when it throws or is empty', () => {
    expect(safe(() => 'ok', 'fallback')).toBe('ok');
    expect(
      safe(() => {
        throw new RangeError('bad locale');
      }, 'fallback')
    ).toBe('fallback');
    expect(safe<string>(() => undefined, 'fallback')).toBe('fallback');
  });
});
