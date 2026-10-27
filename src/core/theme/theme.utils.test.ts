import { resolveDesign } from './theme.utils';

describe('resolveDesign', () => {
  it('matches the platform for auto: iOS, the web, and Material everywhere else', () => {
    expect(resolveDesign('auto', 'ios')).toBe('ios');
    expect(resolveDesign('auto', 'web')).toBe('web');
    expect(resolveDesign('auto', 'android')).toBe('material');
    expect(resolveDesign('auto', 'windows')).toBe('material');
  });

  it('keeps a chosen design on every platform', () => {
    expect(resolveDesign('material', 'ios')).toBe('material');
    expect(resolveDesign('ios', 'android')).toBe('ios');
  });
});
