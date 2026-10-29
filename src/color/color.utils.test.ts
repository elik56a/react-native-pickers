import { DEFAULT_COLORS } from './color.constants';
import {
  getAlphaTrack,
  getCheckColor,
  getDefaultCopy,
  getEyeDropper,
  getFade,
  getHueTrack,
  getIosGridColors,
  getRgbTrack,
  hexToHsv,
  hsvToHex,
  hsvToSpectrum,
  isSwatch,
  normalizeHex,
  normalizeOption,
  resolveColorLabels,
  spectrumToHsv,
  splitAlpha,
  toSwatchCells,
  withAlpha,
} from './color.utils';

describe('normalizeHex', () => {
  it('takes 3, 4, 6 or 8 digits, with or without #, in any case', () => {
    expect(normalizeHex('#e4572e')).toBe('#E4572E');
    expect(normalizeHex(' f80 ')).toBe('#FF8800');
    expect(normalizeHex('#e4572e80')).toBe('#E4572E80');
    expect(normalizeHex('#f808')).toBe('#FF880088');
    expect(normalizeHex('#12345')).toBeNull();
    expect(normalizeHex('red')).toBeNull();
  });

  it('drops a fully opaque alpha', () => {
    expect(normalizeHex('#E4572EFF')).toBe('#E4572E');
  });
});

describe('opacity', () => {
  it('splits the colour from its opacity and puts them back', () => {
    expect(splitAlpha('#E4572E80')).toEqual({ rgb: '#E4572E', alpha: 128 / 255 });
    expect(splitAlpha('#E4572E')).toEqual({ rgb: '#E4572E', alpha: 1 });
    expect(withAlpha('#E4572E', 0.5)).toBe('#E4572E80');
    expect(withAlpha('#E4572E', 1)).toBe('#E4572E');
  });
});

describe('hex and HSV', () => {
  it('converts both ways', () => {
    expect(hexToHsv('#FF0000')).toEqual({ hue: 0, saturation: 1, brightness: 1 });
    expect(hsvToHex({ hue: 1 / 3, saturation: 1, brightness: 1 })).toBe('#00FF00');
    expect(hsvToHex({ hue: 0.5, saturation: 0, brightness: 0.5 })).toBe('#808080');
  });

  it('round-trips every palette colour exactly', () => {
    for (const option of DEFAULT_COLORS) {
      const { value } = normalizeOption(option);
      expect(hsvToHex(hexToHsv(value))).toBe(value);
    }
  });
});

describe("iOS's spectrum", () => {
  it('runs from white through the full colour to black', () => {
    expect(spectrumToHsv(0, 0)).toEqual({ hue: 0, saturation: 0, brightness: 1 });
    expect(spectrumToHsv(0.5, 0.5)).toEqual({ hue: 0.5, saturation: 1, brightness: 1 });
    expect(spectrumToHsv(0, 1)).toEqual({ hue: 0, saturation: 1, brightness: 0 });
  });

  it('places tints above the middle and shades below', () => {
    expect(hsvToSpectrum({ hue: 0.2, saturation: 0.5, brightness: 1 })).toEqual({ x: 0.2, y: 0.25 });
    expect(hsvToSpectrum({ hue: 0.2, saturation: 1, brightness: 0.5 })).toEqual({ x: 0.2, y: 0.75 });
  });
});

describe('tracks', () => {
  it('draws hue, one RGB channel, opacity and the pad fades', () => {
    const hue = getHueTrack(7);
    expect(hue[0]).toBe('#FF0000');
    expect(hue[6]).toBe('#FF0000');
    expect(getRgbTrack('#336699', 0, 2)).toEqual(['#006699', '#FF6699']);
    expect(getAlphaTrack('#336699', 2)).toEqual(['#33669900', '#336699FF']);
    expect(getFade(3, 1, 0).map((f) => f.opacity)).toEqual([1, 0.5, 0]);
  });
});

describe("iOS's grid", () => {
  it('is 12 across: a grey row from white to black, then 9 rows of shades and tints', () => {
    const grid = getIosGridColors();
    expect(grid).toHaveLength(10);
    expect(grid.every((row) => row.length === 12)).toBe(true);
    expect(grid[0]?.[0]).toBe('#FFFFFF');
    expect(grid[0]?.[11]).toBe('#000000');
    expect(new Set(grid.flat()).size).toBe(120);
  });
});

describe('swatches', () => {
  it('normalizes each colour and names it by its code unless given a name', () => {
    expect(toSwatchCells(['#f00', { value: '#00ff00', label: 'Green' }])).toEqual([
      { key: '#FF0000', value: '#FF0000', label: '#FF0000' },
      { key: '#00FF00', value: '#00FF00', label: 'Green' },
    ]);
  });

  it('knows whether a colour is one of them', () => {
    expect(isSwatch(['#f00'], '#FF0000')).toBe(true);
    expect(isSwatch(['#f00'], '#FF0001')).toBe(false);
  });

  it('checks dark on light colours and light on dark ones', () => {
    expect(getCheckColor('#FFEB3B')).toBe(getCheckColor('#FFFFFF'));
    expect(getCheckColor('#3F51B5')).toBe(getCheckColor('#000000'));
    expect(getCheckColor('#FFFFFF')).not.toBe(getCheckColor('#000000'));
  });
});

describe('platform features', () => {
  it('has no clipboard or eyedropper of its own on native', () => {
    expect(getDefaultCopy()).toBeNull();
    expect(getEyeDropper()).toBeNull();
  });
});

describe('resolveColorLabels', () => {
  it('fills what is not given with the English defaults', () => {
    expect(resolveColorLabels({ hue: 'Farbton' })).toMatchObject({ hue: 'Farbton', saturation: 'Saturation', copy: 'Copy' });
  });
});
